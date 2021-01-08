/* eslint-disable react/destructuring-assignment */
import "antd/dist/antd.css"

import React, { useState, useCallback, useEffect } from "react"
import { Checkbox } from "antd"
import { Department } from "../utils/interface"

/** @file departmentCheckBox.tsx
  * @brief implement the DepartmentCheckBox
   
  * @author Hong Eric
  * @date 2021-01-08
  * */

function DepartmentCheckBox(props: any) {
  let temp: any[] = [1]
  const defaultOption: any[] = []
  const [options, setOptions] = useState([{ label: "0", value: "0" }])

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      to fetch the Department data from database, and then change the department's check box
  * @param param_in  None
  * @return None */
  function getDepartment() {
    fetch("https://hw.seabao.ml/api/department", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then(response => {
        return response.json()
      })
      .then((departmentData: Array<Department>) => {
        // set the check box
        temp = []
        departmentData.forEach(element => {
          temp.push({ label: element.name, value: element.name })
          defaultOption.push(element.name)
        })

        setOptions(temp)
        props.currentDepartment.setVal(defaultOption)
      })
  }

  // we need to initialze the checkbox
  const callback = useCallback(element => {
    if (element) {
      getDepartment()
    }
  }, [])
  //------------------------------------------------------------------------------------------------------------
  /** @brief 
     when the following variable changed, we need to render our web again
     1. props.refresh.val -> when user close the form
  */
  useEffect(() => {
    getDepartment()
  }, [props.refresh.val])

  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      change the check box's value
  * @param param_in  None
  * @return None */
  function onChange(checkedValues: any) {
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
