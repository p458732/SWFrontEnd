import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { Form, Input, Button, Col, Select } from "antd"
import "./login.css"
import { Department } from "../component/utils/interface"
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
// fetch URL
const getDepartmentURL = "https://hw.seabao.ml/api/department"
const registrationURL = "https://hw.seabao.ml/api/user"

//依照後端有的部門清單動態產生註冊時的選擇部門選項
const generateOption = (members: string[]) => {
  return members.map(member => {
    return <Option value={member}>{member}</Option>
  })
}

//註冊頁面 component
function Registration() {
  const [form] = Form.useForm()
  //選擇部門選項member
  const [member, setMember] = useState<string[]>([])
  //使用者註冊資訊
  const registrationInfor = {
    name: "",
    email: "",
    departmentName: "",
    password: "",
  }
  let passwordConfirm = false
  //向後端取得部門清單
  const getDepartmentList = () => {
    var departmentList = []
    fetch(getDepartmentURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    })
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(List => {
        console.log(List)
        //成功 fetch 到部門清單就把list加到member中
        setMember(List.map((l: Department) => l.name))
      })
      .catch(err => {
        alert("getDepartment error!")
      })
  }
  //頁面一載入，就自動呼叫function，這裡是為了在一載入頁面時就取得部門清單，以利產生選項
  useEffect(() => {
    getDepartmentList()
  }, [])

  //更新使用者輸入的資料
  const onFinish = async values => {
    console.log("Received values of form: ", values)
    registrationInfor.name = values.name
    registrationInfor.email = values.email
    registrationInfor.password = values.password
  }
  function nameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    registrationInfor.name = e.target.value
  }
  function emailChanged(e: React.ChangeEvent<HTMLInputElement>) {
    registrationInfor.email = e.target.value
  }
  function passwordChanged(password: string) {
    registrationInfor.password = password
  }
  function departmentNameChanged(value, option) {
    registrationInfor.departmentName = value
  }

  //送出註冊 request
  function sendRegisterRequest() {
    //使用者確認密碼必須正確，否則不送出request
    if (!passwordConfirm) {
      return
    } else {
      //送出 request
      console.log("send request")
      // 向後端 post request
      fetch(registrationURL, {
        method: "POST",
        body: JSON.stringify(registrationInfor),
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }).then(res => {
        // 後端回傳 status 500 代表信箱存在
        if (res.status === 500) {
          alert("信箱已存在")
        }
        // 後端回傳 status 400 代表輸入內容不完全，或出現錯誤
        if (res.status === 400) {
          alert("請確認輸入內容")
        }
        // 後端回傳 status 200 代表註冊成功
        if (res.status === 200) {
          alert("註冊成功")
          //註冊成功跳轉回登入頁面，使用者可以立即登入
          window.location.href = "/"
        }
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
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86",
        }}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label={<span>Name&nbsp;</span>}
          rules={[
            {
              required: true,
              message: "Please input your name!",
              whitespace: true,
            },
          ]}
        >
          <Input onChange={nameChanged} />
        </Form.Item>
        <Form.Item
          name="email"
          label="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid Email!",
            },
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input onChange={emailChanged} />
        </Form.Item>

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
          <Input.Password />
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
              //判斷兩個密碼輸入框內容是否相同
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  //相同
                  passwordConfirm = true
                  passwordChanged(value)
                  return Promise.resolve()
                }
                //不相同
                passwordConfirm = false
                return Promise.reject("The two passwords that you entered do not match!")
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select your department"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={departmentNameChanged}
          >
            {generateOption(member)}
          </Select>
          <Col span={5} offset={20}>
            <Button type="primary" htmlType="submit" onClick={sendRegisterRequest}>
              Register
            </Button>
          </Col>
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
export default Registration
