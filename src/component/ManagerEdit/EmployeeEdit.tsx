/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux"
import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { ExclamationCircleOutlined } from "@ant-design/icons"

import { Form, Input, Button, Select, Space, Row, Col, Modal } from "antd"
import { Member, Department } from "../utils/interface"

const { Option } = Select

const { confirm } = Modal

const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
}

const SelectLayout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { offset: 0, span: 16 },
}

const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}

const initEmployee: Member = { name: "", id: "-1", email: "", departmentName: "" }

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}

let changeEmployeeData: Member = initEmployee
let changePassWord = ""
const DepartmentData: Array<Department> = []
function EmployeeEdit(Props: Init) {
  // 設定是否要顯示表單與是否更新主畫面日曆
  const { visible, setVisible, refresh, setrefresh } = Props
  // 設定使用者所選擇的成員
  const [Employee, setEmployee] = React.useState(initEmployee)
  // 設定所有部門資訊
  const [DepartmentList, setDepartmentList] = useState<Department[]>([])
  // 設定password框是否可以輸入
  const [disablePassWord, setDisablepassWord] = useState(true)
  // 設定所有使用者資訊
  const [member, setMember] = useState<Member[]>([])
  // 控制輸入框是必須輸入
  const [require, setRequire] = useState(false)
  // 使用者token
  const token = useSelector((state: any) => state.tokenReducer)
  // 與後端連線所需的設定
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  // 控制表單
  const [form] = Form.useForm()
  // 選擇成員後自動帶入成員資訊至表單
  useEffect(() => {
    changeEmployeeData = {
      name: Employee.name,
      id: Employee.id,
      email: Employee.email,
      departmentName: Employee.departmentName,
    }
    changePassWord = ""
    form.setFieldsValue({ email: Employee.email, department: Employee.departmentName })
  }, [Employee])
  // 抓取所有使用者
  function getEmployeeInfo() {
    const data: Array<Member> = []
    fetch("https://hw.seabao.ml/api/user", {
      method: "GET",
      headers: header,
    })
      .then(res => res.json())
      .then(response => {
        response.forEach((employee: any) => {
          data.push(employee)
        })
        setMember(data)
        console.log("Success", data)
      })
      .catch(error => console.log("error", error))
  }
  // 抓取所有部門
  function getDepartment() {
    const data: Array<Department> = []
    fetch("https://hw.seabao.ml/api/department", {
      method: "GET",
      headers: header,
    })
      .then(res => res.json())
      .then(response => {
        response.forEach((employee: any) => {
          data.push(employee)
        })
        setDepartmentList(data)
        console.log("Success", data)
      })
      .catch(error => console.log("error", error))
  }
  // 當顯示表單時抓取成員與部門資訊並且進行表單初始設定
  useEffect(() => {
    if (visible) {
      getEmployeeInfo()
      getDepartment()
    }
    setEmployee(initEmployee)
    setDisablepassWord(true)
    setRequire(false)
  }, [visible])
  // 顯示錯誤框
  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }
  // 關閉表單與初始化表單
  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }
  // 跳出確認框與確認後跟後端更新資料
  function showPromiseConfirm() {
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要變更此成員嗎?",
      onOk() {
        return fetch("https://hw.seabao.ml/api/user", {
          method: "PATCH",
          body: JSON.stringify(changeEmployeeData), // data can be `string` or {object}!
          headers: header,
        })
          .then(res => {
            console.log("success", res)
            form.resetFields()
            setVisible(false)
            setrefresh(!refresh)
            // 放changeData
          })
          .catch(() => {
            showErrorMessage("變更失敗!")
          })
      },
      onCancel() {},
    })
  }
  // 跳出確認改變密碼確認框與按下確認框後跟後端更新所選擇用戶的密碼
  function showpassWordPromiseConfirm() {
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要變更此成員密碼嗎?",
      onOk() {
        return fetch("https://hw.seabao.ml/api/user/password", {
          method: "PATCH",
          body: JSON.stringify({ id: Employee.id, newPassword: changePassWord }), // data can be `string` or {object}!
          headers: header,
        })
          .then(res => {
            console.log("success", res)
            if (
              Employee.email === changeEmployeeData.email &&
              Employee.departmentName === changeEmployeeData.departmentName
            ) {
              form.resetFields()
              setVisible(false)
              setrefresh(!refresh)
            }
            // 放changeData
          })
          .catch(() => {
            showErrorMessage("變更失敗!")
          })
      },
      onCancel() {},
    })
  }
  // 判斷是否需要呼叫成員資料變更框與密碼變更框
  // 如都沒變更跳出錯誤框
  const onFinish = (values: any) => {
    console.log(Employee)
    console.log(changeEmployeeData)
    console.log(changePassWord)
    if (
      Employee.email === changeEmployeeData.email &&
      Employee.departmentName === changeEmployeeData.departmentName &&
      changePassWord === ""
    )
      showErrorMessage("成員資料未變更")
    else {
      if (Employee.email !== changeEmployeeData.email || Employee.departmentName !== changeEmployeeData.departmentName)
        showPromiseConfirm()
      if (changePassWord !== "") showpassWordPromiseConfirm()
    }
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form {...layout} form={form} name="control-hooks-EmployeeEdit" onFinish={onFinish}>
          <Form.Item name="title">
            <Row justify="start">
              <h1>編輯成員</h1>
            </Row>
          </Form.Item>
          <Form.Item
            name="employee"
            label="employee"
            {...SelectLayout}
            rules={[{ required: true, message: "Select employee is require" }]}
          >
            <Select
              showSearch
              placeholder="Select Employee"
              onChange={value => {
                if (value === undefined) {
                  form.resetFields()
                  setRequire(false)
                  setEmployee(initEmployee)
                  return
                }
                setRequire(true)
                const temp = member.find(element => value === element.email)
                if (temp !== undefined) setEmployee(temp)
              }}
              allowClear
            >
              {member.map(item => (
                <Option value={item.email} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="email" label="email" rules={[{ required: require, message: "Email is require" }]}>
            <Input
              disabled={!require}
              onChange={event => {
                changeEmployeeData.email = event.target.value
              }}
            />
          </Form.Item>
          <Row>
            <Col span={16} offset={2}>
              <Form.Item
                label="PassWord"
                name="password"
                rules={[{ required: !disablePassWord, message: "password is require" }]}
              >
                <Input
                  disabled={disablePassWord}
                  onChange={event => {
                    changePassWord = event.target.value
                  }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                size="middle"
                onClick={value => {
                  console.log(disablePassWord)
                  console.log(require)
                  setDisablepassWord(!disablePassWord)
                }}
              >
                change
              </Button>
            </Col>
          </Row>
          <Form.Item
            name="department"
            label="Department"
            {...SelectLayout}
            rules={[{ required: require, message: "Select department is require" }]}
          >
            <Select
              showSearch
              placeholder="Select a department"
              onChange={value => {
                changeEmployeeData.departmentName = String(value)
                console.log(changeEmployeeData.departmentName)
              }}
              allowClear
              disabled={!require}
            >
              {DepartmentList.map(item => (
                <Option value={item.name} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="button" {...tailLayout}>
            <Space size="middle">
              <Button onClick={handleCancel} type="default">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EmployeeEdit
