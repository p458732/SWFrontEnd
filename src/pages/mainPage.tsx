import React, { useState } from "react"
import ReactDOM from "react-dom"
import moment from "moment"
import { Layout } from "antd"
import { Redirect } from "react-router-dom"
import SideBarCalendar from "../component/sideBar/calendar"
import DepartmentCheckBox from "../component/sideBar/departmentCheckBox"
import Scheduler from "../component/scheduler/scheduler"
import Schedulerr from "../component/scheduler/scheduler2"
import { useSelector, useDispatch } from "react-redux"
const { Sider, Content } = Layout

function Main() {
  const token = useSelector((state: storeTypes) => state.tokenReducer)

  const email = useSelector((state: storeTypes) => state.emailReducer)
  console.log("email = " + email)
  const [currentDate, setCurrentDate] = useState(moment())
  const [currentChooseDepartment, setCurrentChooseDepartment] = useState([])
  const [refreshDepartment, setrefreshDepartment] = useState(false)
  const [departmentDisable, setDepartmentDisable] = useState(true)
  const department = { val: currentChooseDepartment, setVal: setCurrentChooseDepartment }
  const disable = { val: departmentDisable, setVal: setDepartmentDisable }
  const state = { val: currentDate, setVal: setCurrentDate }
  const refresh = { val: refreshDepartment, setVal: setrefreshDepartment }

  return token === 0 ? (
    <Redirect to={{ pathname: "/login" }} />
  ) : (
    <Layout hasSider="true">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsible={true}
        width="300"
        theme="light"
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <SideBarCalendar currentDate={state} />
        <DepartmentCheckBox
          currentDepartment={department}
          departmentDisabled={disable}
          refresh={refresh}
          token={token}
        />
      </Sider>
      <Content>
        <Scheduler
          currentDate={state}
          currentDepartment={department}
          departmentDisabled={disable}
          refresh={refresh}
          token={token}
        />
      </Content>
    </Layout>
  )
}

export default Main
/*  */
