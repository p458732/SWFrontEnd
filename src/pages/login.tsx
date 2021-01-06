import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { Form, Input, Button, Checkbox, Layout, Row, Col, Image, Alert } from "antd"
import "./login.css"
import { Link, HashRouter as router, Route, Switch } from "react-router-dom"
import { useSelector, useDispatch, Provider } from "react-redux"
import { setToken, setEmail } from "./action/token/token"
import { setRole } from "./action/role/role"
import store from "./reducers/configureStore"

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 7 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
  layout: "vertical",
}
const loginURL = "https://sw-virtualmeetingassitant-auth.azurewebsites.net/connect/token"
const userInfoURL = "https://sw-virtualmeetingassitant-auth.azurewebsites.net/connect/userinfo"
function Login() {
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
  const loginInfo = { email: "", password: "" }
  const data = {
    grant_type: "password",
    username: "",
    password: "",
    client_id: "frontend.client",
    client_secret: "0AH#wjlzaU#&&P*XkY74",
  }

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
  function getUserRole(token: string) {
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

        handleRole(info.role)
      })
      .catch(e => {
        console.log("getUserRole error")
      })
  }
  const authenticate = () => {
    updateData()

    const request = {
      grant_type: "password",
      username: data.username,
      password: data.password,
      client_id: "frontend.client",
      client_secret: "0AH#wjlzaU#&&P*XkY74",
    }

    var body = []
    for (var property in request) {
      var encodeKey = encodeURIComponent(property)
      var encodeValue = encodeURIComponent(request[property])
      body.push(encodeKey + "=" + encodeValue)
    }
    body = body.join("&")
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
        //
        window.location.href = "/#/mainPage"
      })
      .catch(e => {
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
        <Row>
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

export default Login
