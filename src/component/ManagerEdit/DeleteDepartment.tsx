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

import { ExclamationCircleOutlined } from "@ant-design/icons"

import { Form, Input, Button, Select, Space, Row, Modal, Tag } from "antd"
import { Member, Department, header } from "../utils/interface"

const { Option } = Select

const { confirm } = Modal

const { TextArea } = Input

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
}
let Employee: Member[] = []
function DeleteDepartment(Props: Init) {
  const { visible, setVisible } = Props
  const [department, setDepartment] = useState<Department>()
  const [DepartmentList, setDepartmentList] = useState<Department[]>([])
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
        Employee = data
        console.log("Success", data)
      })
      .catch(error => console.log("error", error))
  }

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
    getEmployeeInfo().then(() => {
      const judgeData = Employee.filter(element => department?.attendees.some(judge => element.id === judge))
      console.log(judgeData)
      form.setFieldsValue({
        member: judgeData.map(element => `${element.name} <${element.email}>`).join("\n"),
      })
    })
  }, [department])

  useEffect(() => {
    if (visible) {
      getDepartment()
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

  function showPromiseConfirm() {
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要刪除此部門嗎?",
      onOk() {
        return fetch(`https://hw.seabao.ml/api/department?departmentName=${department?.name}`, {
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
    console.log("finish", DepartmentList)
  }

  const onFinishFailed = () => {
    console.log("error", DepartmentList)
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form
          {...layout}
          form={form}
          name="control-hooks-DeleteDepartment"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="title">
            <Row justify="start">
              <h1>刪除部門</h1>
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
          <Form.Item name="member" label="Member">
            <TextArea allowClear placeholder="Member" autoSize={{ minRows: 3, maxRows: 5 }} readOnly />
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

export default DeleteDepartment
