import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import "antd/dist/antd.css"
import { FormInstance } from "antd/lib/form"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Form, Input, Button, Checkbox, Layout, Row, Col, Image, Tooltip, Cascader, Select, AutoComplete } from "antd"
import "./login.css"
import { User } from "../component/utils/interface"

import { QuestionCircleOutlined } from "@ant-design/icons"
const { Header, Footer, Sider, Content } = Layout

const { Option } = Select
const AutoCompleteOption = AutoComplete.Option
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

function forgotPassword() {
  const [form] = Form.useForm()

  const onFinish = values => {
    console.log("Received values of form: ", values)
  }

  return (
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
        <Input />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Request
        </Button>
      </Form.Item>
    </Form>
  )
}

export default forgotPassword
