import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { FormInstance } from "antd/lib/form"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Form, Input, Button, Checkbox, Layout, Row, Col, Image } from "antd"
import "./login.css"
import { User } from "../../component/utils/interface"
import { PresetColorTypes } from "antd/lib/_util/colors"

const { Header, Footer, Sider, Content } = Layout

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 7 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
  layout: "vertical",
}

export default function login() {
  const info = { email: "", password: "" }
  const onFinish = values => {
    console.log("Success:", values)
  }

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo)
  }
  function emailChanged(e: React.ChangeEvent<HTMLInputElement>) {
    info.email = e.target.value
    console.log(info)
  }
  function passwordChanged(e: React.ChangeEvent<HTMLInputElement>) {
    info.password = e.target.value
    console.log(info)
  }
  const authenticate = () => {}

  return (
    <div className="app">
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row style={{ justifyContent: "center" }}>
          <Col style={{ justifyContent: "center" }}>
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMxLRsNXgKhis8w186C_Kex9ReeD6BB4wzw&usqp=CAU"
              width={250}
              height={250}
            />
            <h1 style={{ fontWeight: "bolder" }}> SeaBao Back-End God </h1>
          </Col>
        </Row>
        <Row className="email">
          <Form.Item
            className="email"
            label={<label style={{ fontWeight: "bolder" }}>Email</label>}
            name="Email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input onChange={emailChanged} />
          </Form.Item>
        </Row>
        <Row className="password">
          <Form.Item
            className="password"
            label={<label style={{ fontWeight: "bolder" }}>Password</label>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password onChange={passwordChanged} />
          </Form.Item>
        </Row>
        <Row>
          <Col span={3} offset={7}>
            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Col>
          <Button type="link" style={{ color: "#3030FF", fontWeight: "bolder" }}>
            New Account
          </Button>
          <Button type="link" style={{ color: "#3030FF", fontWeight: "bolder" }}>
            Forgot Password
          </Button>
          <Col span={5}>
            <Form.Item {...tailLayout}>
              <Button onClick={authenticate} type="primary" htmlType="button">
                Login
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
