import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { Form, Input, Button, Col,  Select } from "antd"
import "./login.css"
import {  useLocation} from "react-router-dom"
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
const resetPasswordURL = "https://hw.seabao.ml/api/otp?otp="
// 重設密碼頁面component
function ResetPassword() {
  // 獲取 query 中的資料，此頁面進入時會帶有otp
  const searchParams = new URLSearchParams(useLocation().search)
  const newPassword = {
    newPassword: "",
  }
  let passwordConfirm = false
  const [form] = Form.useForm()
  const onFinish = values => {
    console.log("Received values of form: ", values)
  }
  //輸入框內容變更時即更新資料
  function passwordChanged(password: string) {
    newPassword.newPassword = password
    passwordConfirm = true
  }
  // 重設密碼 request
  const resetRequest = () => {
    if (!passwordConfirm) {
      return
    } else {
      //取得使用者 query中的 otp ，加進 fetch URL後面
      const fetchURL = resetPasswordURL + searchParams.get("otp")
      console.log(fetchURL)
      // 向後端 post 重設密碼 request，後端會依照 otp 判斷與驗證使用者身分
      fetch(fetchURL, {
        method: "POST",
        body: JSON.stringify(newPassword),
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }).then(res => {
        //後端回傳 status 200 為重設密碼成功
        if (res.status === 200) {
          alert("已重設密碼")
          //導回登入頁面，使用者可用新密碼登入
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
              // 判斷確認密碼是否一致
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
