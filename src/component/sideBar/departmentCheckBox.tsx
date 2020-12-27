import "antd/dist/antd.css"

import React, { useState, useContext, useCallback } from "react"
import { Checkbox } from "antd"
import { header, Department } from "../utils/interface"

function DepartmentCheckBox(props) {
  let temp = []
  let defaultOption = []
  const [options, setOptions] = useState([])

  function getDepartment() {
    fetch("https://hw.seabao.ml/api/department", {
      method: "GET",
      headers: header,
    })
      .then(response => {
        return response.json()
      })
      .then((departmentData: Array<Department>) => {
        departmentData.forEach(element => {
          temp.push({ label: element.name, value: element.name })
          defaultOption.push(element.name)
        })

        setOptions(temp)
        props.currentDepartment.setVal(defaultOption)
      })
  }

  const callback = useCallback(element => {
    if (element) {
      getDepartment()
    }
  }, [])
  function onChange(checkedValues) {
    props.currentDepartment.setVal(checkedValues)
  }

  return (
    <div className="site-calendar-customize-header-wrapper" ref={callback}>
      <Checkbox.Group
        options={options}
        disabled={props.departmentDisabled.val}
        defaultValue={defaultOption}
        onChange={onChange}
      />
    </div>
  )
}

export default DepartmentCheckBox
