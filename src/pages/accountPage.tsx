import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { Form, Input, Button, Checkbox, Layout, Row, Col, Image, Alert } from "antd"
import "./login.css"
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setToken, setEmail } from "./action/token/token"
import loginWrapper from "./login"
import forgotPassword from "./forgotPassword"
import ResetPassword from "./resetPassword"
import Registration from "./registration"
function accountPage() {
  useEffect(() => {
    console.log("in account page")
  }, [])
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={loginWrapper} />
          <Route path="/forgotPassword" component={forgotPassword} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/registration" component={Registration} />
        </Switch>
      </div>
    </Router>
  )
}
export default accountPage
