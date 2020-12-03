import React, { useState } from "react"
import ReactDOM from "react-dom"
import moment from "moment"
import { Layout } from "antd"
import SideBarCalendar from "../component/sideBar/calendar"
import Scheduler from "../component/scheduler/scheduler"

const { Sider, Content } = Layout

export default function Home() {
  const currentDateTime = React.createContext(moment().format("YYYY/MM/DD HH:mm:ss"))
  return (
    <Layout hasSider="true">
      <currentDateTime.Provider value={moment().format("YYYY/MM/DD HH:mm:ss")}>
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
          <SideBarCalendar />
        </Sider>
        <Content>
          <Scheduler />
        </Content>
      </currentDateTime.Provider>
    </Layout>
  )
}
