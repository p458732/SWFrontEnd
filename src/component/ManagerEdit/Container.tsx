import React from "react"
import containerStyles from "./Container.css"

export default ({ children }) => (
  <div className={containerStyles.container}>{children}</div>
)
