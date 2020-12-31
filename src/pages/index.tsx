import React, { useState } from "react"
import { Layout } from "antd"
import { Provider } from "react-redux"
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"

import Main from "./mainPage"
import Login from "./login"
import store from "./reducers/configureStore"
import Registration from "./forgotPassword"

export default function Home() {
  return (
    <HashRouter>
      <Switch>
        <Layout>
          <Provider store={store}>
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route exact path="/mainPage" component={Main} />
          </Provider>
        </Layout>
      </Switch>
    </HashRouter>
  )
}
