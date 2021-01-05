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

import { Form, Select, Modal, Tag, Row, Col, Space, Button } from "antd"
import { Member, Department } from "../utils/interface"

const { Option } = Select

const { confirm } = Modal

const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
}

const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}

const SelectLayout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { offset: 0, span: 16 },
}

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}
const InitDepartment: Department = { name: "", attendees: [] }
let changeData: Department = InitDepartment
function EditDepartment(Props: Init) {
  const { visible, setVisible, refresh, setrefresh } = Props
  const [member, setMember] = useState<Member[]>([])
  const [department, setDepartment] = useState<Department>(InitDepartment)
  const [DepartmentList, setDepartmentList] = useState<Department[]>([])
  const token = useSelector((state: any) => state.tokenReducer)
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  const [form] = Form.useForm()

  async function getEmployeeInfo() {
    const data: Array<Member> = []
    await fetch("https://hw.seabao.ml/api/user", {
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
    changeData.name = department.name
    getEmployeeInfo().then(() => {
      const judgeData = member.filter(element => department?.attendees.some(judge => element.id === judge))
      console.log(judgeData)
      changeData.attendees = judgeData.map(element => `${element.email}`)
      form.setFieldsValue({
        member: judgeData.map(element => `${element.email}`),
      })
    })
  }, [department])

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

  useEffect(() => {
    if (visible) {
      getDepartment()
    } else {
      changeData = InitDepartment
    }
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

  function tagRender(props: any) {
    const { label, value, closable, onClose } = props

    return (
      <Tag color="gold" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    )
  }

  function showPromiseConfirm() {
    const num: number[] = []
    member.forEach(item => {
      if (changeData.attendees.some(email => email === item.email)) num.push(Number(item.id))
    })
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要新增此部門嗎?",
      onOk() {
        return fetch("https://hw.seabao.ml/api/department", {
          method: "POST",
          body: JSON.stringify({ name: changeData.name, ids: num }), // data can be `string` or {object}!
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
            showErrorMessage("新增失敗!")
          })
      },
      onCancel() {},
    })
  }

  const onFinish = (values: any) => {
    if (
      changeData.attendees.length === department.attendees.length &&
      changeData.attendees.every(element => department.attendees.some(judge => judge.email === element.email))
    )
      showErrorMessage("未變更資料")
    else showPromiseConfirm()
    console.log("finish", changeData)
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
          name="control-hooks-EditDepartment"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="title">
            <Row justify="start">
              <h1>編輯部門</h1>
            </Row>
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            {...SelectLayout}
            rules={[{ required: true, message: "Select department is require" }]}
          >
            <Select
              showSearch
              placeholder="Select a department"
              onChange={value => {
                const temp = DepartmentList.find(item => item.name === value)
                if (temp !== undefined) setDepartment(temp)
              }}
              allowClear
            >
              {DepartmentList.map(item => (
                <Option value={item.name} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="member" label="Member" rules={[{ required: true, message: "Select Member is require" }]}>
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              allowClear
              onChange={(value: any) => {
                changeData.attendees = value
                console.log(changeData)
              }}
              maxTagCount={5}
              maxTagTextLength={40}
            >
              {member.map(item => (
                <Option value={item.email} key={item.id}>
                  {`${item.name} <${item.email}>`}
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
                New
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditDepartment
