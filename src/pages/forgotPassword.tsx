import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import "antd/dist/antd.css"

import { Form, Input, Button, Checkbox, Layout, Row, Col, Image, Tooltip, Cascader, Select, AutoComplete } from "antd"
import "./login.css"
const { Header, Footer, Sider, Content } = Layout

const { Option } = Select
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}
const forgotPasswordURL = "https://hw.seabao.ml/api/user/forget-pw"
function forgotPassword() {
  const [form] = Form.useForm()
  const info = {
    email: "",
  }
  const onFinish = values => {
    console.log("Received values of form: ", values)
    info.email = values.email
  }
  const emailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    info.email = e.target.value
  }
  const postForgotPW = async () => {
    const requestBody = {
      email: info.email,
    }
    fetch(forgotPasswordURL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    })
      .then(res => {
        if (res.status === 404) {
          alert("信箱不存在")
        }
        if (res.status === 200) {
          alert("已寄出信件")
          window.location.href = "/"
        }
        return res.json()
      })
      .then(resp => {})
      .catch(e => {})
  }
  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86",
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input onChange={emailChanged} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" onClick={postForgotPW}>
            Request
          </Button>
        </Form.Item>
      </Form>
      <Col span={5} offset={21}>
        <Button
          type="primary"
          onClick={() => {
            window.location.href = "/"
          }}
        >
          back to login
        </Button>
      </Col>
    </div>
  )
}

export default forgotPassword
