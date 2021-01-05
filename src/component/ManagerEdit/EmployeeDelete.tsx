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

import { Form, Input, Button, Select, Space, Row, Modal } from "antd"

import { Member } from "../utils/interface"

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

function EmployeeDelete(Props: Init) {
  const { visible, setVisible, refresh, setrefresh } = Props
  const [Employee, setEmployee] = React.useState(initEmployee)
  const [member, setMember] = useState<Member[]>([])
  const token = useSelector((state: any) => state.tokenReducer)
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ email: Employee.email, department: Employee.departmentName })
  }, [Employee])

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

  useEffect(() => {
    if (visible) getEmployeeInfo()
    setEmployee(initEmployee)
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
      content: "你確定要刪除此成員嗎?",
      onOk() {
        return fetch(`https://hw.seabao.ml/api/user?userId=${parseInt(Employee.id, 10)}`, {
          method: "DELETE",
          headers: header,
        })
          .then(res => {
            console.log("success", res)
            form.resetFields()
            setVisible(false)
            // 放changeData
          })
          .catch(() => {
            showErrorMessage("刪除失敗!")
          })
      },
      onCancel() {},
    })
  }

  const onFinish = (values: any) => {
    showPromiseConfirm()
  }

  const onFinishFailed = () => {
    console.log("error")
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form
          {...layout}
          form={form}
          name="control-hooks-EmployeeDelete"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="title">
            <Row justify="start">
              <h1>刪除成員</h1>
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
                  setEmployee(initEmployee)
                  return
                }
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
          <Form.Item name="email" label="email">
            <Input disabled={!require} readOnly />
          </Form.Item>
          <Form.Item name="department" label="Department" {...SelectLayout}>
            <Input disabled={!require} readOnly />
          </Form.Item>
          <Form.Item name="button" {...tailLayout}>
            <Space size="middle">
              <Button onClick={handleCancel} type="default">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" danger>
                Delete
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EmployeeDelete
