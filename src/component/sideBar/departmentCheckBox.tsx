import React from "react"
import "antd/dist/antd.css"
import { header, Department } from "../utils/interface"
import { Checkbox } from "antd"

let options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" },
]
function getDepartment() {
  fetch("https://hw.seabao.ml/api/department", {
    method: "GET",
    headers: header,
  })
    .then(response => {
      return response.json()
    })
    .then((departmentData: Array<Department>) => {
      console.log(departmentData)
    })
}
function onChange(checkedValues) {
  getDepartment()
}

const optionsWithDisabled = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange", disabled: false },
]

function DepartmentCheckBox(props) {
  return (
    <div className="site-calendar-customize-header-wrapper">
      <Checkbox.Group options={options} defaultValue={["Pear"]} onChange={onChange} />
    </div>
  )
}

export default DepartmentCheckBox
