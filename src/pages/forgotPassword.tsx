import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"

import { Form, Input, Button,Col} from "antd"
import "./login.css"
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
// fetch URL
const forgotPasswordURL = "https://hw.seabao.ml/api/user/forget-pw"

// 忘記密碼頁面 component
function forgotPassword() {
  const [form] = Form.useForm()
  //儲存使用者輸入的email
  const info = {
    email: "",
  }
  const onFinish = values => {
    console.log("Received values of form: ", values)
    info.email = values.email
  }
  //輸入框變更就更新資料
  const emailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    info.email = e.target.value
  }
  //向後端送出使用者忘記密碼的申請
  const postForgotPW = async () => {
    
    const requestBody = {
      email: info.email,
    }
    // 向後端 post request
    fetch(forgotPasswordURL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    })
      .then(res => {
        // 後端回傳 status 404 為找不到信箱
        if (res.status === 404) {
          alert("信箱不存在")
        }
        // 後端回傳 status 200 為申請成功且信件寄出
        if (res.status === 200) {
          alert("已寄出信件")
          //申請成功及導向登入頁面
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
