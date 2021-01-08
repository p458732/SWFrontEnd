import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { Form, Input, Button,Row, Col, Image,Space } from "antd"
import "./login.css"
import { Link,} from "react-router-dom"
import { useDispatch } from "react-redux"
import { setToken, setEmail } from "./action/token/token"
import { setRole } from "./action/role/role"
//layout 格式
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 7 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
  layout: "vertical",
}
// fetch URL
const loginURL = "https://sw-virtualmeetingassitant-auth.azurewebsites.net/connect/token"
const userInfoURL = "https://sw-virtualmeetingassitant-auth.azurewebsites.net/connect/userinfo"

//登入頁面compoenent
function Login() {
  //redux 儲存 function
  const dispatch = useDispatch()
  const handleToken = (tokenStr: string): void => {
    dispatch(setToken(tokenStr))
  }
  const handleEmail = (emailStr: string): void => {
    dispatch(setEmail(emailStr))
  }
  const handleRole = (roleStr: string): void => {
    dispatch(setRole(roleStr))
  }
  // 儲存使用者輸入資訊的資料
  const loginInfo = { email: "", password: "" }
  const data = {
    grant_type: "password",
    username: "",
    password: "",
    client_id: "frontend.client",
    client_secret: "0AH#wjlzaU#&&P*XkY74",
  }
  //輸入框內容更改後更新資料
  const emailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    loginInfo.email = e.target.value
    console.log(JSON.stringify(loginInfo))
  }
  const passwordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    loginInfo.password = e.target.value
    console.log(JSON.stringify(loginInfo))
  }
  const updateData = () => {
    data.username = loginInfo.email
    data.password = loginInfo.password
    console.log(JSON.stringify(data))
  }
  //在使用者登入後取得使用者身分權限
  function getUserRole(token: string) {
    //fetch 使用者資訊
    fetch(userInfoURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => {
        return res.json()
      })
      .then(info => {
        console.log("AFDFDSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSLK:ALFS")
        console.log(info)
        //把使用者身分權限存用redux存下，讓主頁面的component可以拿到資料
        handleRole(info.role)
      })
      .catch(e => {
        console.log("getUserRole error")
      })
  }
  //登入驗證function，使用者按下login button 後即呼叫此function
  const authenticate = () => {
    updateData()
    //fetch時需要攜帶的body資料
    const request = {
      grant_type: "password",
      username: data.username,
      password: data.password,
      client_id: "frontend.client",
      client_secret: "0AH#wjlzaU#&&P*XkY74",
    }
    
    //將request的資料重新編碼後帶給後端。
    var body = []
    for (var property in request) {
      var encodeKey = encodeURIComponent(property)
      var encodeValue = encodeURIComponent(request[property])
      body.push(encodeKey + "=" + encodeValue)
    }
    body = body.join("&")

    //向後端 post 登入 request
    fetch(loginURL, {
      body: body,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        if (data.error) {
          alert("帳號或密碼錯誤")
          return
        } else {
          handleToken(data.access_token)
          handleEmail(request.username)

          return data.access_token
        }
        //登入
      })
      .then(token => {
        getUserRole(token)
        //登入成功就導向主頁面
        window.location.href = "/#/mainPage"
      })
      .catch(e => {
        //錯誤資訊
        console.log(e.error_description)
        alert(e.error_description)
        console.log("faild")
      })
  }
  
  return (
    <div className="app">
      <Form {...layout} name="basic" initialValues={{ remember: true }}>
        <Row style={{ justifyContent: "center" }}>
          <Col style={{ justifyContent: "center" }}>
            <Image src={require("../img/logo.png")} width={250} height={250} />
            <h1 style={{ fontWeight: "bolder" }}> Virtual Meeting Assitant </h1>
          </Col>
        </Row>
        <Row className="email">
          <Form.Item
            className="email"
            label={<label style={{ fontWeight: "bolder" }}>Email</label>}
            name="Email"
            rules={[{ message: "Please input your Email!" }]}
          >
            <Input onChange={emailChanged} />
          </Form.Item>
        </Row>
        <Row className="password">
          <Form.Item
            className="password"
            label={<label style={{ fontWeight: "bolder" }}>Password</label>}
            name="password"
            rules={[{ message: "Please input your password!" }]}
          >
            <Input.Password onChange={passwordChanged} />
          </Form.Item>
        </Row>
        <Col span={5} offset={9}>
          <Space direction="horizontal">
            <Link to="/registration">
              <Button type="link" style={{ color: "#3030FF", fontWeight: "bolder" }}>
                New Account
              </Button>
            </Link>

            <Link to="/forgotPassword">
              <Button type="link" style={{ color: "#3030FF", fontWeight: "bolder" }}>
                Forgot Password
              </Button>
            </Link>

            <Form.Item {...tailLayout}>
              <Button onClick={authenticate} type="primary" htmlType="button">
                Login
              </Button>
            </Form.Item>
          </Space>
        </Col>
      </Form>
    </div>
  )
}

export default Login
