import React, { useState } from "react"
import { Layout } from "antd"
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"
import Main from "./mainPage"
import Login from "./login"
import Registration from "./forgotPassword"

export default function Home() {
  return (
    <HashRouter>
      <Switch>
        <Layout>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route exact path="/mainPage" component={Main} />
        </Layout>
      </Switch>
    </HashRouter>
  )
}
