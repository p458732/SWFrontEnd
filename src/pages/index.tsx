import React, { useState } from "react"
import { Layout } from "antd"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import Main from "./mainPage"
import Login from "./login"
import store from "./reducers/configureStore"
import accountPage from "./accountPage"
import Registration from "./forgotPassword"

export default function Home() {
  return (
    <Router>
      <Switch>
        <Layout>
          <Provider store={store}>
            <Route exact path="/" component={accountPage} />
            <Route exact path="/mainPage" component={Main} />
          </Provider>
        </Layout>
      </Switch>
    </Router>
  )
}
