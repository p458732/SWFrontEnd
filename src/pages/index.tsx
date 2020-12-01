import React from "react"
import ReactDOM from "react-dom"
import { Layout, Menu } from "antd"
import Scheduler from "../component/scheduler/scheduler"

import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons"

import App from "../component/sideBar/sideBar"

const { Header, Content, Footer, Sider } = Layout

export default function Home() {
  return (
    <Layout hasSider="true">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsible={true}
        theme="light"
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <div className="logo" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={["4"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            nav 4
          </Menu.Item>
        </Menu>
      </Sider>
      <Scheduler />
    </Layout>
  )
}
