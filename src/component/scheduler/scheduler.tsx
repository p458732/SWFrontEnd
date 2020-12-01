/* eslint-disable react/button-has-type */ /* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useState } from "react"
import GSTC from "gantt-schedule-timeline-calendar"
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
import getRoom from "./fetchRoom"

import "gantt-schedule-timeline-calendar/dist/style.css"
import "./App.css"
import RoomEdit from "../ManagerEdit/roomEdit"

import ManagerEdit from "../ManagerEdit/ManagerEdit"

import { Room, Meeting } from "../utils/interface"

// helper functions
let state: any = {}
let gstc: any = {}

let lastItemId = -1
const meetingURL = "https://hw.seabao.ml/api/meeting"
// function generateRows() {
//   /**
//    * @type { import("gantt-schedule-timeline-calendar").Rows }
//    */
//   const rows: any = {}
//   for (let i = 0; i < 10; i += 1) {
//     const id = GSTC.api.GSTCID(i.toString())
//     rows[id] = {
//       id,
//       label: `Row ${i}`,
//     }
//   }
//   return rows
// }

const hours = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: "day",
    periodIncrement: 1,
    format({ timeStart }: { timeStart: any }) {
      return timeStart.format("DD") // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
]

const minutes = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: "minute",
    periodIncrement: 60,
    main: true,
    format({ timeStart }: { timeStart: any }) {
      return timeStart.format("HH:mm") // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
]
function initializeGSTC(element: any) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
      "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), Selection()],
    list: {
      columns: {
        data: {
          [GSTC.api.GSTCID("id")]: {
            id: GSTC.api.GSTCID("id"),
            width: 60,
            sortable: "capacity",
            header: {
              content: "ID",
            },
          },
          [GSTC.api.GSTCID("label")]: {
            id: GSTC.api.GSTCID("label"),
            sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
            width: 200,
            data: "label",
            sortable: "label",
            header: {
              content: "Label",
            },
          },
          [GSTC.api.GSTCID("capacity")]: {
            id: GSTC.api.GSTCID("capacity"),
            width: 0,
            data: "capacity",
            header: {
              content: "capacity",
            },
          },
        },
      },

      rows: [
        {
          id: "0",
          label: "",
        },
      ],
    },
    chart: {
      items: [],
      calendarLevels: [hours, minutes],
      time: {
        zoom: 14,
      },
    },
  }

  state = GSTC.api.stateFromConfig(config)

  gstc = GSTC({
    element,
    state,
  })
}

const fakedata = [
  {
    name: "TR200",
    capacity: 12,
  },
  {
    name: "TR500",
    capacity: 10,
  },
  {
    name: "RB500",
    capacity: 20,
  },
]

function Scheduler() {
  // const [meetings, setMeetings] = useState([])
  const [roomList, setroomList] = useState<Array<Room>>(fakedata)
  const [meetingList, setmeetingList] = useState(0)
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false)

  // useEffect(() => () => {
  //   if (gstc) {
  //     gstc.destroy()
  //   }
  // })

  function changeZoomLevel() {
    state.update("config.chart.time.zoom", 14)
  }
  function onItemClick(item) {
    setSaveEditFormVsible(true)
  }

  function itemLabelContent({ item, vido }) {
    console.log(1)
    return vido.html`<div class="my-item-content" style="width:100%"  @click=${() => onItemClick(item)}>${
      item.title
    }</div>`
  }

  function generateNewItems(meeting: any) {
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
  function postMeeting(data?: Meeting) {
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
          getMeeting()
        } else {
          alert("cannot add new meeting")
        }
      })
  }
  function getMeeting() {
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

  const callback = useCallback(element => {
    if (element) {
      console.log(1)
      initializeGSTC(element)
      getRoom(state)
      getMeeting()
    }
  }, [])
  return (
    <div className="Scheduler">
      <div className="toolbox">
        <button
          onClick={() => {
            getMeeting()
          }}
        >
          getMeeting
        </button>
        <button
          onClick={() => {
            getRoom(state)
          }}
        >
          getRoom
        </button>
        <button
          onClick={() => {
            postMeeting(state)
          }}
        >
          postMeeting
        </button>
        <button onClick={changeZoomLevel}>Change zoom level</button>
        <button
          onClick={() => {
            setSaveEditFormVsible(true)
          }}
        >
          Save
        </button>
      </div>
      <div className="gstc-w Schedulerer" ref={callback} />
      <RoomEdit
        type="Save"
        roomList={roomList}
        setRoomList={setroomList}
        setvisible={setSaveEditFormVsible}
        visible={editSaveFormVisible}
      />
    </div>
  )
}

export default Scheduler
