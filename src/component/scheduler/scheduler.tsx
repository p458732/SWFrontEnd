/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */ /* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */

/** @file scheduler.tsx
  * @brief implement the main functional requirements
   
  * @author Hong Eric
  * @date 2021-01-08
  * */

import { Row, Col, Dropdown, Button, Menu } from "antd"
import { PlusOutlined, UserOutlined, DownOutlined, HomeFilled } from "@ant-design/icons"
import { useSelector } from "react-redux"
import React, { useCallback, useEffect, useState } from "react"
import GSTC from "gantt-schedule-timeline-calendar"
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
import getRoom from "./fetchRoom"
import { getUser, getUserId } from "./fetchUser"
import "gantt-schedule-timeline-calendar/dist/style.css"
import "./App.css"
import NewMeetingForm from "../Meeting/NewMeetingForm"
import ViewMeetingForm from "../Meeting/ViewMeetingForm"
import MeetingForm from "../Meeting/MeetingForm"
import { Meeting } from "../utils/interface"
import ManagerEdit from "../ManagerEdit/ManagerEdit"
import GoogleCalendar from "../GoogleCalendar/GoogleCalendar"
import { storeTypes } from "../../pages/reducers/configureStore"

// our gannt chart
let gstc: any = {}
// gstc's state , used to update the gstc data
let state: any = {}
// to store last time what date the user choosed
let previousDate: any
// to store last time what week the user choosed
let previousEndWeekDate: any

function Scheduler(props: any) {
  let itemNum = 0

  const userInfoURL = "https://sw-virtualmeetingassitant-auth.azurewebsites.net/connect/userinfo"
  const meetingURL = "https://hw.seabao.ml/api/meeting" // API URL
  // to notify scheduler should refresh when users close the form
  const [refresh, setRefresh] = useState<boolean>(false)
  // to store the all users of database
  const [userList, setUserList] = useState<any>("init")
  // control the editform whether opening
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false)
  // control the newform whether opening
  const [newMeetingFormVisible, setNewMeetingFormVisible] = useState(false)
  // control the viewform whether opening
  const [viewMeetingFormVisible, setViewMeetingFormVisible] = useState(false)
  // store current the meeting that the users select to
  const [currentSelectMeeting, setCurrentSelectMeeting] = useState({
    title: "",
    description: "",
    location: "",
    repeatType: -1,
    toDate: "",
    fromDate: "",
    attendees: [],
    departments: [],
  })
  // store the view mode value , day or week
  const [downButtonStr, setDownButtonStr] = useState("day")
  // store the view mode value , room or user
  const [viewMode, setViewMode] = useState("room")
  // store the meeting related the user
  const [userMeeting, setUserMeeting] = useState<Array<Meeting>>([])
  // store current user's id
  const [userId, setUserId] = useState<number>(-1)
  // store current user's info
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userInfo, setUserInfo] = useState(0)
  // store JWT token to access the database
  const token = useSelector((stateReducer: storeTypes) => stateReducer.tokenReducer)
  // store the user's emdil
  const userEmail = useSelector((stateReducer: storeTypes) => stateReducer.emailReducer)

  // used to gstc's unit, that is, gantt chart's x-axis
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
      format({ timeStart }: any) {
        return timeStart.format("MM") // full list of formats: https://day.js.org/docs/en/display/format
      },
    },
  ]
  // used to gstc's unit, that is, gantt chart's x-axis
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
      format({ timeStart }: any) {
        return timeStart.format("DD") // full list of formats: https://day.js.org/docs/en/display/format
      },
    },
  ]

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      update the info of the user who just logged in
  * @param param_in  None
  * @return None */
  function getUserRole() {
    fetch(userInfoURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        return res.json()
      })
      .then(info => {
        // set info
        setUserInfo(info)
      })
      .catch(() => {})
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      to open the new form  when users click the space of the gantt chart
  * @param param_in  None
  * @return None */
  function onCellClick() {
    setNewMeetingFormVisible(true)
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      search the meeting about the current user, because we just want to export the meeting that relate the current user
  * @param param_in  meeting-> all of the database's meeting
  * @return None */
  function searchUserMeeting(meeting: any) {
    // temp array to save the temp meetings
    const temp: Array<Meeting> = []
    meeting.forEach((meet: any) => {
      meet.attendees.forEach((attendee: any) => {
        // check whether the user attends the meeting
        if (attendee === userId) {
          temp.push(meet)
        }
      })
    })
    setUserMeeting(temp)
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      implement to click cells to open the new form
  * @param param_in  vido-> a html format 
  * @return the cell of the gantt chart */
  function onCellCreate({ vido }: any) {
    return vido.html`<div class="my-grid-cell" @click=${() =>
      onCellClick()} style="color:white;cursor:pointer;width:100%;height:70px;"></div>`
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      initialize our GSTC, here is that setting the config 
  * @param param_in  element-> a html format 
  * @return gstc */
  function initializeGSTC(element: any) {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Config }
     */

    // eslint-disable-next-line prefer-destructuring
    // config of gstc
    // ref url: https://gantt-schedule-timeline-calendar.neuronet.io/documentation
    const config: any = {
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
              sortable: ({ row }: any) => Number(GSTC.api.sourceID(row.id)),
              width: 200,
              data: "label",
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

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      change the zoom of gantt chart, in order for implement the switch day/week 
  * @param param_in  zoom -> the view number of gantt chart 
  * @return  None */
  function changeZoomLevel(zoom: number) {
    state.update("config.chart.time.zoom", zoom)
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      when users click the item, we need to judge their role to open the corresponding form
      
      Manager or Creator ->  open the Edit form
      other              ->  open the View form
  * @param param_in  item -> the item that the user current clicks
  * @return  None */
  function onItemClick(item: any) {
    // set the Meeting Info
    setCurrentSelectMeeting(item.meetingJSON)
    // judge user role and open corresponding form
    if (props.role === "Manager" || item.meetingJSON.creatorUid === userId) setSaveEditFormVsible(true)
    else setViewMeetingFormVisible(true)
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      implement to click items to open the meeting form
  * @param param_in  vido-> a html format 
  * @return the items of the gantt chart */
  function itemLabelContent({ item, vido }: any) {
    return vido.html`<div class="my-item-content" style="width:100%"  @click=${() => onItemClick(item)}>${
      item.title
    }</div>`
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      to generate Items of the gantt charts, we need to according to the view mode  to change our row 
  * @param param_in  meeting -> database's meeting
  * @return the items of the gantt chart */
  function generateNewItems(meeting: any) {
    const items: any = {}
    // if view mode is room, then our gantt chart's row is room name
    if (viewMode === "room") {
      for (let i = 0, len = meeting.length; i < len; i += 1) {
        // set the gstc info
        const rowId = GSTC.api.GSTCID(meeting[i].location)
        const id = GSTC.api.GSTCID(String(meeting[i].meetingID))
        const startDayjs = GSTC.api.date(meeting[i].fromDate)
        items[id] = {
          id,
          label: itemLabelContent,
          title: meeting[i].title,
          // database info
          meetingJSON: meeting[i],
          time: {
            start: startDayjs.valueOf(),
            end: GSTC.api.date(meeting[i].toDate).valueOf(),
          },
          rowId,
        }
      }
    } // if view mode is user, then our gantt chart's row is user name
    else if (viewMode === "user") {
      // iterate the meeting -> attendee -> department
      for (let i = 0, len = meeting.length; i < len; i += 1) {
        for (let k = 0; k < meeting[i].attendees.length; k += 1) {
          for (let j = 0; j < props.currentDepartment.val.length; j += 1) {
            if (meeting[i].departments[0] === props.currentDepartment.val[j]) {
              // set the gstc info
              const rowId = GSTC.api.GSTCID(userList.get(meeting[i].attendees[k]))

              // eslint-disable-next-line no-plusplus
              const id = GSTC.api.GSTCID(String(++itemNum))
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
              break
            }
          }
        }
      }
    }
    return items
  }
  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      to fetch the Meeting data from database
  * @param param_in  None
  * @return None */
  function getMeeting() {
    fetch(meetingURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        return response.json()
      })
      .then(meeting => {
        state.update("config.chart.items", () => {
          return generateNewItems(meeting)
        })

        searchUserMeeting(meeting)
      })
      .then(() => {})
  }

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      to change the icon of switch view mode Btn
  * @param param_in  None
  * @return the corrensponding icon */
  function ModeIcon() {
    if (viewMode === "room") {
      return <UserOutlined style={{ fontSize: "48px" }} />
    }
    return <HomeFilled style={{ fontSize: "48px" }} />
  }
  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      initialize the scheduler 
  */
  const callback = useCallback(element => {
    if (element) {
      initializeGSTC(element)
      getUserRole()
      getRoom(state, token)

      getUserId(userEmail, token, setUserId)
      getMeeting()

      previousDate = props.currentDate.val.valueOf()
    }
  }, [])

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
     when the following variable changed, we need to render our web again
     
     1. userList   ->  when we have a new employee
     2. refresh    ->  when user close the form
     3. props.currentDepartment.val   ->    when user choose the different department
  */
  useEffect(() => {
    getMeeting()
  }, [userList])
  useEffect(() => {
    getMeeting()
    getRoom(state, token)
    props.refresh.setVal(!props.refresh.val)
  }, [refresh])
  useEffect(() => {
    getMeeting()
    // eslint-disable-next-line react/destructuring-assignment
  }, [props.currentDepartment.val])

  //  when every times we render, we need to set up the  interval of gantt chart, of course according the mode day/week
  //  we should change reasonably, otherwise gstc will crash
  if (gstc && state.id !== undefined) {
    // if view mode is day , we just could see 1 day
    if (downButtonStr === "day") {
      // if last time we choose is later than current date, we should change the start first then change the end
      if (previousDate > props.currentDate.val.valueOf()) {
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("day").valueOf())
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("day").valueOf())
      } // if last time we choose is earlier than current date, we should change the end first then change the start
      else {
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("day").valueOf())
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("day").valueOf())
      }
    } // if view mode is week , we just could see 7 days
    else if (downButtonStr === "week") {
      if (props.currentDate.val.valueOf() >= previousEndWeekDate) {
        // if last time we choose is earlier than current date, we should change the end first then change the start
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("week").valueOf())
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("week").valueOf())
      } else {
        // if last time we choose is later than current date, we should change the start first then change the end
        state.update("config.chart.time.from", GSTC.api.date(props.currentDate.val).startOf("week").valueOf())
        state.update("config.chart.time.to", GSTC.api.date(props.currentDate.val).endOf("week").valueOf())
      }
    }

    //
    previousDate = props.currentDate.val.valueOf()
    // previousEndWeekDate = props.currentDate.val.endOf("week").valueOf() WTF?
  }
  // if user's role is Manager then the edit Btn will show up
  return props.role === "Manager" ? (
    <div className="Scheduler">
      <div className="toolbox">
        <Row>
          <Col span={3}>
            <ManagerEdit refresh={refresh} setrefresh={setRefresh} />
          </Col>
          <Col span={3} offset={9}>
            <Button
              onClick={() => {
                setNewMeetingFormVisible(true)
              }}
              icon={<PlusOutlined style={{ fontSize: "48px" }} />}
              style={{ width: 60, height: 60 }}
            />
          </Col>
          <Col span={3}>
            <GoogleCalendar MeetingData={userMeeting} />
          </Col>
          <Col span={3}>
            <Button
              onClick={() => {
                if (viewMode === "room") {
                  props.departmentDisabled.setVal(false)
                  getUser(state, setUserList, token)

                  setViewMode("user")
                } else {
                  props.departmentDisabled.setVal(true)

                  getRoom(state, token)
                  setUserList([])
                  setViewMode("room")
                }
              }}
              icon={<ModeIcon />}
              style={{ width: 60, height: 60 }}
            />
          </Col>
          <Col span={3}>
            <Dropdown
              overlay={
                <Menu
                  onClick={(e: any) => {
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
      <NewMeetingForm
        setVisible={setNewMeetingFormVisible}
        visible={newMeetingFormVisible}
        refresh={refresh}
        setrefresh={setRefresh}
      />
      <ViewMeetingForm
        setVisible={setViewMeetingFormVisible}
        visible={viewMeetingFormVisible}
        meetingData={currentSelectMeeting}
      />
      <MeetingForm
        setVisible={setSaveEditFormVsible}
        visible={editSaveFormVisible}
        meetingData={currentSelectMeeting}
        refresh={refresh}
        setrefresh={setRefresh}
      />
    </div>
  ) : (
    <div className="Scheduler">
      <div className="toolbox">
        <Row>
          <Col span={3} />
          <Col span={3} offset={9}>
            <Button
              onClick={() => {
                setNewMeetingFormVisible(true)
              }}
              icon={<PlusOutlined style={{ fontSize: "48px" }} />}
              style={{ width: 60, height: 60 }}
            />
          </Col>
          <Col span={3}>
            <GoogleCalendar MeetingData={userMeeting} />
          </Col>
          <Col span={3}>
            <Button
              onClick={() => {
                if (viewMode === "room") {
                  props.departmentDisabled.setVal(false)
                  getUser(state, setUserList, token)

                  setViewMode("user")
                } else {
                  props.departmentDisabled.setVal(true)

                  getRoom(state, token)
                  setUserList([])
                  setViewMode("room")
                }
              }}
              icon={<ModeIcon />}
              style={{ width: 60, height: 60 }}
            />
          </Col>
          <Col span={3}>
            <Dropdown
              overlay={
                <Menu
                  onClick={(e: any) => {
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
      <NewMeetingForm
        setVisible={setNewMeetingFormVisible}
        visible={newMeetingFormVisible}
        refresh={refresh}
        setrefresh={setRefresh}
      />
      <ViewMeetingForm
        setVisible={setViewMeetingFormVisible}
        visible={viewMeetingFormVisible}
        meetingData={currentSelectMeeting}
      />
      <MeetingForm
        setVisible={setSaveEditFormVsible}
        visible={editSaveFormVisible}
        meetingData={currentSelectMeeting}
        refresh={refresh}
        setrefresh={setRefresh}
      />
    </div>
  )
}

export default Scheduler
