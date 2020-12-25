import React, { useCallback, useEffect, useState } from "react"
import GSTC from "gantt-schedule-timeline-calendar"
import { Meeting, Room } from "../utils/interface"
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
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer " +
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IkMyNjhEMUIwNkY2MkI0Qjc3MzY1QkY1RDkyNDgyNjYzIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MDg4OTc1MTcsImV4cCI6MTYwODkwMTExNywiaXNzIjoiaHR0cHM6Ly9zdy12aXJ0dWFsbWVldGluZ2Fzc2l0YW50LWF1dGguYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOiJodHRwczovL3N3LXZpcnR1YWxtZWV0aW5nYXNzaXRhbnQtYXV0aC5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJjbGllbnRfaWQiOiJmcm9udGVuZC5jbGllbnQiLCJzdWIiOiIyMSIsImF1dGhfdGltZSI6MTYwODg5NzUxNywiaWRwIjoibG9jYWwiLCJqdGkiOiJEMEY1N0VCQzIxMUE0NjYyRTlCQkE3OTYyRjNERkRBRSIsImlhdCI6MTYwODg5NzUxNywic2NvcGUiOlsibWVldGluZy1hcGlzIl0sImFtciI6WyJwd2QiXX0.oNiitreJOMTd-EtTxcjNkDCEdfEV-XRMsnCUtTRmHAR72S6ZwHwaMqR7_RaDEsh3AuxsbG-IB4F1M9qg5nZfW0OdiLmlHNkGt8D9FB-oMTAdtSJuANeIhBPKlrMA4JMArlVeYlaeQT3Dr0bfbhkuE0V6K9RAOPcMDTkLu2j7QWiXUKnEYKQ3vj3AfHZiRLaHCv4hMi4RXXl9B0mvwr_5go9HXHzr3ZPhSg1OTKGyxLhx4eOD0glyoqjJMc58-6B-qVF3TKboN0aDUTsXE_w5I0UPjc66z8CfnSvNNnwGy9QfJfp98-2LPzm3uuWhvj5eGlNsIQl8IK7ou7T14yTMig",
    },
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
