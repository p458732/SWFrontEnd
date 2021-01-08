import React from "react"
import { Layout } from "antd"
import { Provider } from "react-redux"
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import Main from "./mainPage"
import Login from "./login"
import store from "./reducers/configureStore"
import Registration from "./registration"
import forgotPassword from "./forgotPassword"
import ResetPassword from "./resetPassword"

export default function Home() {
  return (
    <Router>
      <Switch>
        <Layout>
          <Provider store={store}>
            <Route path="/" exact component={Login} />
            <Route path="/login" exact component={Login} />
            <Route path="/forgotPassword" component={forgotPassword} />
            <Route path="/resetPassword" component={ResetPassword} />
            <Route path="/registration" component={Registration} />
            <Route exact path="/mainPage" component={Main} />
          </Provider>
        </Layout>
      </Switch>
    </Router>
  )
}
