/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import Icon from "antd/lib/icon"
import { FormInstance } from "antd/lib/form"
import { EnvironmentOutlined, FontSizeOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Space,
  Row,
  Col,
  Modal,
  Tag,
} from "antd"
import { Room, User, Department, Meeting } from "../utils/interface"

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

const departmentList: Array<Department> = [
  { name: "Personnel Department" },
  { name: "Sales Department" },
  { name: "Business Office" },
]

interface Meet {
  title: string
  description: string
  roomName: string
}
interface Member {
  name: string
  uid: number
  email: string
  department: Department
}

const member: Array<Member> = [
  { name: "gold", uid: 0, email: "123@gmail.com", department: { name: "Personnel Department" } },
  { name: "lime", uid: 1, email: "456@gmail.com", department: { name: "Personnel Department" } },
  { name: "green", uid: 2, email: "789@gmail.com", department: { name: "Sales Department" } },
  { name: "cyan", uid: 3, email: "987@gmail.com", department: { name: "Personnel Department" } },
  { name: "gold", uid: 4, email: "654@gmail.com", department: { name: "Sales Department" } },
  { name: "111", uid: 5, email: "321@gmail.com", department: { name: "Business Office" } },
]

const initEmployee: Member = { name: "", uid: -1, email: "", department: { name: "" } }

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
}

let changeEmployeeData: Member = initEmployee

function EmployeeEdit(Props: Init) {
  const { visible, setVisible } = Props
  const [Employee, setEmployee] = React.useState(initEmployee)
  const [disablePassWord, setDisablepassWord] = useState(true)
  const [require, setRequire] = useState(false)
  const [form] = Form.useForm()
  let changePassWord = ""
  useEffect(() => {
    console.log(Employee)
    changeEmployeeData = Employee
    console.log(changeEmployeeData)
    changePassWord = ""
    form.setFieldsValue({ email: Employee.email, department: Employee.department.name })
  }, [Employee])

  useEffect(() => {
    setEmployee(initEmployee)
    setDisablepassWord(true)
    setRequire(false)
  }, [visible])

  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }

  function showPromiseConfirm() {
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要變更此成員嗎?",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.1 ? resolve : reject, 1000)
        })
          .then(() => {
            form.resetFields()
            setVisible(false)
            // 放changeData
          })
          .catch(() => {
            showErrorMessage("變更失敗!")
          })
      },
      onCancel() {},
    })
  }

  const onFinish = (values: any) => {
    console.log(changeEmployeeData)
    console.log(changePassWord)
    showPromiseConfirm()
  }

  const onFinishFailed = () => {
    console.log("error")
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
                <Option value={item.email} key={item.uid}>
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
                changeEmployeeData.department.name = String(value)
                console.log(changeEmployeeData.department.name)
              }}
              allowClear
              disabled={!require}
            >
              {departmentList.map(item => (
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
