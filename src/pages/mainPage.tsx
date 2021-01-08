/* eslint-disable react/jsx-boolean-value */
import React, { useState } from "react"
import moment from "moment"
import { Layout } from "antd"
import { Redirect } from "react-router-dom"
import { useSelector } from "react-redux"
import SideBarCalendar from "../component/sideBar/calendar"
import DepartmentCheckBox from "../component/sideBar/departmentCheckBox"
import Scheduler from "../component/scheduler/scheduler"
import { storeTypes } from "./reducers/configureStore"

const { Sider, Content } = Layout

function Main() {
  const token = useSelector((state: storeTypes) => state.tokenReducer) // JWT token
  const role = useSelector((state: storeTypes) => state.roleReducer) // current user's role
  const [currentDate, setCurrentDate] = useState(moment()) // current date which user clicked
  const [currentChooseDepartment, setCurrentChooseDepartment] = useState([]) // current departments which user clicked
  const [refreshDepartment, setrefreshDepartment] = useState(false) // to determine what time to render the web
  const [departmentDisable, setDepartmentDisable] = useState(true) // to determine the disable of departments when we switch to room view mode
  const department = { val: currentChooseDepartment, setVal: setCurrentChooseDepartment } // integrate the state to pass the sub component
  const disable = { val: departmentDisable, setVal: setDepartmentDisable } // integrate the state to pass the sub component
  const state = { val: currentDate, setVal: setCurrentDate } // integrate the state to pass the sub component
  const refresh = { val: refreshDepartment, setVal: setrefreshDepartment } // integrate the state to pass the sub component

  // if we did't get the token then we redirect to login page.
  // Otherwise, we redirect to the main Page!
  return token === 0 ? (
    <Redirect to={{ pathname: "/login" }} />
  ) : (
    <Layout hasSider={true}>
      <Sider breakpoint="lg" collapsedWidth="0" collapsible={true} width="300" theme="light">
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
          role={role}
        />
      </Content>
    </Layout>
  )
}

export default Main
/*  */
