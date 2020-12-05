import React, { useState } from "react"
import ReactDOM from "react-dom"
import moment from "moment"
import { Layout } from "antd"
import SideBarCalendar from "../component/sideBar/calendar"
import Scheduler from "../component/scheduler/scheduler"

const { Sider, Content } = Layout

export default function Home() {
  const [currentDate, setCurrentDate] = useState(moment())
  const state = { val: currentDate, setVal: setCurrentDate }
  return (
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
      </Sider>
      <Content>
        <Scheduler currentDate={state} />
      </Content>
    </Layout>
  )
}
