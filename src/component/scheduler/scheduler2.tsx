import React, { useCallback, useEffect, useState, useContext } from "react"
import GSTC from "gantt-schedule-timeline-calendar"
import moment from "moment"
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
import getRoom from "./fetchRoom"

import "gantt-schedule-timeline-calendar/dist/style.css"
import "./App.css"
import RoomEdit from "../ManagerEdit/roomEdit"
import NewMeetingForm from "../Meeting/NewMeetingForm"
import ViewMeetingForm from "../Meeting/ViewMeetingForm"
import { Room, Meeting } from "../utils/interface"
import { Row, Col, Menu, Dropdown, Button } from "antd"
import { PlusOutlined, EditFilled, DeliveredProcedureOutlined, UserOutlined, DownOutlined } from "@ant-design/icons"
import ManagerEdit from "../ManagerEdit/ManagerEdit"

let state: any = {}
let gstc: any = {}
let previousDate: any
let previousDateEndOfMonth: any
let lastItemId = -1
const meetingURL = "https://hw.seabao.ml/api/meeting"
function Schedulerr(props) {
  function initializeGSTC(element: any) {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Config }
     */

    // eslint-disable-next-line prefer-destructuring
    const date = GSTC.api.date
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
        grid: {
          cell: {
            onCreate: [onCellCreate],
          },
        },

        time: {
          from: GSTC.api.date(props.currentDate.val).startOf("day").valueOf(), // from 2020-01-01
          to: GSTC.api.date(props.currentDate.val).endOf("day").valueOf(), //

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

  function onItemClick(item) {
    console.log(item)
    let meetingDataTemp = {
      meetingID: item.id.match(/\d+/),
      title: item.title,
      description: "null temp",
      location: item.rowId.substr(6),
      // attendees?: Array<User>
      // departments: Array<string>
      // creatorUid?: number
      repeatType: 0,
      // updatedDate?: string
      // createdDate?: string
      fromDate: moment(item.time.start).format(),
      toDate: moment(item.time.end).format(),
    }
  }

  function itemLabelContent({ item, vido }) {
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
      const id = GSTC.api.GSTCID(String(meeting[i].meetingID))
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
  function onCellCreate({ time, row, vido }) {
    return vido.html`<div class="my-grid-cell" @click=${() =>
      onCellClick(row, time)} style="color:white;cursor:pointer;width:100%;height:70px;"></div>`
  }
  function onCellClick(row, time) {}

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

        state.update("config.chart.grid.cell.onCreate", () => {
          return [onCellCreate]
        })
        props.currentDate.setVal(props.currentDate.val.add(1, "day"))
      })
  }
  const callback = useCallback(element => {
    if (element) {
      console.log(props.currentDate.val)
      initializeGSTC(element)
      getRoom(state)
      getMeeting()

      previousDate = props.currentDate.val.valueOf()
    }
  }, [])
  // 下拉式選單內的文字
  getMeeting()
  return (
    <div className="Scheduler">
      <div className="toolbox">
        <Row>
          <Col span={3}>
            <ManagerEdit />
          </Col>
          <Col span={3} offset={9}>
            <PlusOutlined onClick={() => getMeeting()} style={{ fontSize: "48px" }} />{" "}
          </Col>
          <Col span={3}>
            <DeliveredProcedureOutlined style={{ fontSize: "48px" }} />
          </Col>
          <Col span={3}>
            <UserOutlined style={{ fontSize: "48px" }} />
          </Col>
          <Col span={3}></Col>
        </Row>
      </div>
      <div className="gstc-w Schedulerer" ref={callback} />
    </div>
  )
}
export default Schedulerr
