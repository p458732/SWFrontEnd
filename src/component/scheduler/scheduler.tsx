/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */ /* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
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
import { Room, Meeting, header } from "../utils/interface"
import { Row, Col, Menu, Dropdown, Button } from "antd"
import { PlusOutlined, EditFilled, DeliveredProcedureOutlined, UserOutlined, DownOutlined } from "@ant-design/icons"
import ManagerEdit from "../ManagerEdit/ManagerEdit"

// helper functions
let state: any = {}
let gstc: any = {}
let previousDate: any
let previousEndWeekDate: any
let previousDateEndOfMonth: any
let lastItemId = -1

function Scheduler(props) {
  // getNowDate
  const date = GSTC.api.date

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
  const [roomList, setroomList] = useState<Array<Room>>(fakedata)
  const [meetingList, setmeetingList] = useState(0)
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false) // 決定是否要開啟編輯meeting表單
  const [newMeetingFormVisible, setNewMeetingFormVisible] = useState(false) // 決定是否要開啟建立meeting表單
  const [viewMeetingFormVisible, setViewMeetingFormVisible] = useState(false) // 決定是否要開啟查看meeting表單
  const [currentSelectMeeting, setCurrentSelectMeeting] = useState({})
  const meetingURL = "https://hw.seabao.ml/api/meeting" // 資料來源
  const [downButtonStr, setDownButtonStr] = useState("day")
  const hours = [
    {
      zoomTo: 14, // we want to display this format for all zoom levels until 100
      period: "day",
      periodIncrement: 1,
      format({ timeStart }: { timeStart: any }) {
        return timeStart.format("DD") // full list of formats: https://day.js.org/docs/en/display/format
      },
    },
    {
      zoomTo: 19, // this format will be used as first level when config.chart.time.zoom will be greater than 22 (23...100)
      period: "month",
      periodIncrement: 1,
      format({ timeStart }) {
        return timeStart.format("MM") // full list of formats: https://day.js.org/docs/en/display/format
      },
    },
  ]
  // 表格的橫軸大小
  const minutes = [
    {
      zoomTo: 14, // we want to display this format for all zoom levels until 100
      period: "minute",
      periodIncrement: 60,
      main: true,
      format({ timeStart }: { timeStart: any }) {
        return timeStart.format("HH:mm") // full list of formats: https://day.js.org/docs/en/display/format
      },
    },
    {
      zoomTo: 19, // this format will be used as second level when config.chart.time.zoom will be greater than 22 (23...100)
      period: "day",
      periodIncrement: 1,
      main: true, // we want grid to be divided by this period = month = there will be year level and month level from zoom >= 23
      format({ timeStart }) {
        return timeStart.format("DD") // full list of formats: https://day.js.org/docs/en/display/format
      },
    },
  ]
  // 當表格中的空格被點擊時 開啟建立新會議表單
  function onCellClick(row, time) {
    setNewMeetingFormVisible(true)
  }
  function getMeeting() {
    fetch(meetingURL, {
      method: "GET",
      headers: header,
    })
      .then(response => {
        return response.json()
      })
      .then(meeting => {
        state.update("config.chart.items", () => {
          return generateNewItems(meeting)
        })
        // state.update("config.chart.grid.cell.onCreate", () => {
        //   return [onCellCreate]
        // })
      })
  }
  function onCellCreate({ time, row, vido }) {
    return vido.html`<div class="my-grid-cell" @click=${() =>
      onCellClick(row, time)} style="color:white;cursor:pointer;width:100%;height:70px;"></div>`
  }
  // 表格的橫軸大小

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
          {
            id: "2",
            label: "",
          },
          {
            id: "3",
            label: "",
          },
          {
            id: "3",
            label: "",
          },
          {
            id: "3",
            label: "",
          },
          {
            id: "3",
            label: "",
          },
          {
            id: "3",
            label: "",
          },
          {
            id: "3",
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
        calendarLevels: [hours, minutes],
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

  // 當點選小日曆時要根據點選的日期來改變表格
  // have bug
  if (gstc && state.id !== undefined) {
    if (downButtonStr === "day") {
      if (previousDate > props.currentDate.val.valueOf()) {
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("day").valueOf())
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("day").valueOf())
      } else {
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("day").valueOf())
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("day").valueOf())
      }
    } else if (downButtonStr === "week") {
      if (props.currentDate.val.valueOf() >= previousEndWeekDate) {
        console.log("0000000000000000")
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("week").valueOf())
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("week").valueOf())
      } else {
        console.log("111111111111111")
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("week").valueOf())
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("week").valueOf())
      }
    }

    previousDate = props.currentDate.val.valueOf()
    previousEndWeekDate = props.currentDate.val.endOf("week").valueOf()
    console.log(props.currentDate.val.startOf("week"))
    console.log(props.currentDate.val.endOf("week"))
  }

  function changeZoomLevel(zoom: number) {
    state.update("config.chart.time.zoom", zoom)

    //  state.update("config.chart.time.from", props.currentDate.val.startOf("month").valueOf())
    // state.update("config.chart.time.to", props.currentDate.val.endOf("month").valueOf())
  }

  // 處理Meeting 可以點選視窗 以及內容---------------------------------------------------------------
  function onItemClick(item) {
    console.log("iteMMASDADASDASDASDAS", item)

    // item.fromDate = moment(item.time.start).format()
    // item.toDate = moment(item.time.end).format()
    setCurrentSelectMeeting(item.meetingJSON)
    setViewMeetingFormVisible(true)
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
        meetingJSON: meeting[i],
        time: {
          start: startDayjs.valueOf(),
          end: GSTC.api.date(meeting[i].toDate).valueOf(),
        },
        rowId,
      }
    }
    return items
  }

  // ----------------------------------處理Meeting 可以點選視窗 以及內容END---------------------------------------------------------------
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
          <Col span={3}>
            <Dropdown
              overlay={
                <Menu
                  onClick={e => {
                    setDownButtonStr(e.key)
                    if (e.key === "week") changeZoomLevel(19)
                    else changeZoomLevel(14)
                  }}
                >
                  <Menu.Item key="day">day</Menu.Item>
                  <Menu.Item key="week">week</Menu.Item>
                </Menu>
              }
            >
              <Button>
                {downButtonStr}
                <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </div>
      <div className="gstc-w Schedulerer" ref={callback} />
      <NewMeetingForm setVisible={setNewMeetingFormVisible} visible={newMeetingFormVisible} />
      <ViewMeetingForm
        setVisible={setViewMeetingFormVisible}
        visible={viewMeetingFormVisible}
        meetingData={currentSelectMeeting}
      />
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
