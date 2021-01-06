import React, { useEffect, useState } from "react"
import { Renderer } from "react-dom"
import "antd/dist/antd.css"
import { Form, Input, Button, Checkbox, Layout, Row, Col, Image, Tooltip, Cascader, Select } from "antd"
import "./login.css"
import { HashRouter as Router, useLocation, Route, useHistory } from "react-router-dom"
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
const resetPasswordURL = "https://hw.seabao.ml/api/otp?otp="
function ResetPassword() {
  const searchParams = new URLSearchParams(useLocation().search)
  const newPassword = {
    newPassword: "",
  }
  let passwordConfirm = false
  const [form] = Form.useForm()
  const onFinish = values => {
    console.log("Received values of form: ", values)
  }
  function passwordChanged(password: string) {
    newPassword.newPassword = password
    passwordConfirm = true
  }
  const resetRequest = () => {
    if (!passwordConfirm) {
      return
    } else {
      const fetchURL = resetPasswordURL + searchParams.get("otp")
      console.log(fetchURL)
      fetch(fetchURL, {
        method: "POST",
        body: JSON.stringify(newPassword),
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }).then(res => {
        if (res.status === 200) {
          alert("已重設密碼")
          window.location.href = "/"
        } else {
          alert("錯誤")
        }
        return res.json()
      })
    }
  }
  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: "86",
        }}
        scrollToFirstError
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  passwordChanged(value)
                  return Promise.resolve()
                }

                return Promise.reject("The two passwords that you entered do not match!")
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" onClick={resetRequest}>
            Reset
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
export default ResetPassword
