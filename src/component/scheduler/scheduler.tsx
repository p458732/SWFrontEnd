/* eslint-disable react/button-has-type */ /* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import React, { useCallback, useEffect } from "react"
import GSTC from "gantt-schedule-timeline-calendar"
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js"
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js"

import "gantt-schedule-timeline-calendar/dist/style.css"
import "./App.css"

const meetingURL = "https://hw.seabao.ml/api/meeting"
const roomURL = "https://hw.seabao.ml/api/room"
// helper functions
let state: any = {}
let gstc: any = {}

const testMeetingData: any = {
  departments: ["IE"],
  description: "test Data",
  fromDate: "2020-11-28T17:58:14.804Z",
  toDate: "2020-11-30T17:58:14.804Z",
  title: "testPost",
  repeatType: 0,
  roomName: "TR-303",
}
let lastItemId = -1
let lastRowId = -1
function generateNewRows(room: any) {
  const rows: any = {}
  for (let i = 0; i < room.length; i += 1) {
    const id = GSTC.api.GSTCID(room[i].name)
    rows[id] = {
      id,
      label: room[i].name,
      capacity: room[i].capacity,
      expanded: false,
    }
  }
  console.log(rows)
  return rows
}
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

function generateNewItems(meeting: any) {
  let rowsIds = []
  if (gstc) {
    const rows = gstc.api.getAllRows()
    rowsIds = Object.keys(rows)
  } else {
    for (let i = 0; i < iterations; i++) {
      rowsIds.push(GSTC.api.GSTCID(String(i)))
    }
  }
  const items = {}
  for (let i = 0, len = meeting.length; i < len; i += 1) {
    console.log(meeting[i])
    const rowId = GSTC.api.GSTCID(meeting[i].location)
    const id = GSTC.api.GSTCID(String((lastItemId += 1)))
    const startDayjs = GSTC.api.date(meeting[i].fromDate)
    items[id] = {
      id,
      label: meeting[i].title,
      time: {
        start: startDayjs.valueOf(),
        end: GSTC.api.date(meeting[i].toDate).valueOf(),
      },
      rowId,
    }
  }
  return items
}

function getRoom() {
  fetch(roomURL, {
    method: "GET",
  })
    .then(response => {
      return response.json()
    })
    .then(room => {
      state.update("config.list.rows", () => {
        return generateNewRows(room)
      })
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
        return generateNewItems(meeting)
      })
    })
}
function postMeeting(data: any) {
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
    format({ timeStart, vido }) {
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

function Scheduler() {
  // const [meetings, setMeetings] = useState([])

  const callback = useCallback(element => {
    if (element) {
      initializeGSTC(element)
    }
  }, [])

  useEffect(() => () => {
    if (gstc) {
      gstc.destroy()
    }
  })

  function updateFirstRow() {
    state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row: any) => {
      // eslint-disable-next-line no-param-reassign
      row.label = "Changed dynamically"
      return row
    })
  }

  function changeZoomLevel() {
    state.update("config.chart.time.zoom", 14)
  }

  return (
    <div className="Scheduler">
      <div className="toolbox">
        <button onClick={getMeeting}>getMeeting</button>
        <button onClick={getRoom}>getRoom</button>
        <button onClick={postMeeting}>postMeeting</button>
        <button onClick={updateFirstRow}>Update first row</button>
        <button onClick={changeZoomLevel}>Change zoom level</button>
      </div>
      <div className="gstc-w Schedulerer" ref={callback} />
    </div>
  )
}

export default Scheduler
