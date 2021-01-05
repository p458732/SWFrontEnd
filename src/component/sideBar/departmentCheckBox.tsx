import "antd/dist/antd.css"

import React, { useState, useContext, useCallback, useEffect } from "react"
import { Checkbox } from "antd"
import { header, Department } from "../utils/interface"

function DepartmentCheckBox(props) {
  let temp = []
  let defaultOption = []
  const [options, setOptions] = useState([])

  function getDepartment() {
    fetch("https://hw.seabao.ml/api/department", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token,
      },
    })
      .then(response => {
        return response.json()
      })
      .then((departmentData: Array<Department>) => {
        temp = []
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
  useEffect(() => {
    // 使用瀏覽器 API 更新文件標題
    getDepartment()
  }, [props.refresh.val])

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
