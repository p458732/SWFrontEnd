import React, { useCallback, useEffect, useState } from "react"
import GSTC from "gantt-schedule-timeline-calendar"
import { Meeting,Room } from "../utils/interface"
import RoomEdit from "../ManagerEdit/roomEdit"

import ManagerEdit from "../ManagerEdit/ManagerEdit"
const testMeetingData: Meeting = {
  attendee: [],
  departments: ["IE"],
  description: "test Data",
  fromDate: "2020-11-28T17:58:14.804Z",
  toDate: "2020-11-30T17:58:14.804Z",
  title: "testPost",
  repeatType: 0,
  roomName: "TR-303",
}

let lastItemId = -1
function onItemClick(item) {
  console.log(item)
  alert("Item " + GSTC.api.sourceID(item.id) + " clicked!")
}

function itemLabelContent({ item, vido }) {
  console.log(item)
  return vido.html`<div class="my-item-content" style="cursor:pointer;" onclick=${() =>
    onItemClick(
      item
    )}><span style="width:12px;height:12px;background:white;border-radius:100%;display:inline-block;margin-right:4px;vertical-align:middle;"></span>My HTML content here!</div>`
}
const meetingURL = "https://hw.seabao.ml/api/meeting"
function generateNewItems(meeting: any, gstc: any) {
  let rowsIds = []
  if (gstc) {
    const rows = gstc.api.getAllRows()
    rowsIds = Object.keys(rows)
  } else {
    // for (let i = 0; i < iterations; i++) {
    //   rowsIds.push(GSTC.api.GSTCID(String(i)))
    // }
  }
  // meeting[i].title
  const items = {}
  for (let i = 0, len = meeting.length; i < len; i += 1) {
    console.log(meeting[i])
    const rowId = GSTC.api.GSTCID(meeting[i].location)
    const id = GSTC.api.GSTCID(String((lastItemId += 1)))
    const startDayjs = GSTC.api.date(meeting[i].fromDate)
    items[id] = {
      id,
      label: itemLabelContent,
      title: meeting[i].title,
      time: {
        start: startDayjs.valueOf(),
        end: GSTC.api.date(meeting[i].toDate).valueOf(),
      },
      rowId,
    }
  }
  return items
}
function getMeeting(state: any, gstc: any) {
  fetch(meetingURL, {
    method: "GET",
  })
    .then(response => {
      return response.json()
    })
    .then(meeting => {
      state.update("config.chart.items", () => {
        return generateNewItems(meeting, gstc)
      })
    })
}

function postMeeting(state: any, gstc: any, data?: Meeting) {
  data = testMeetingData
  fetch(meetingURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then(response => {
      return response.status
    })
    .then(status => {
      if (status === 200) {
        getMeeting(state, gstc)
      } else {
        alert("cannot add new meeting")
      }
    })
}
function MeetingButton() {
  const [roomList, setroomList] = useState<Array<Room>>(fakedata)
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false)
  return (
    <RoomEdit
      type="Save"
      roomList={roomList}
      setRoomList={setroomList}
      setvisible={setSaveEditFormVsible}
      visible={editSaveFormVisible}
    />
  )
}
export { getMeeting, postMeeting, MeetingButton }
