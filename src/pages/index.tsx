import React from "react"
import ReactDOM from "react-dom"
import { Layout } from "antd"
import SideBarCalendar from "../component/sideBar/calendar"
import Scheduler from "../component/scheduler/scheduler"

const { Sider, Content } = Layout

export default function Home() {
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
        <SideBarCalendar />
      </Sider>
      <Content>
        <Scheduler />
      </Content>
    </Layout>
  )
}
