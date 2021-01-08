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

import { Form, Input, Button, Select, Space, Row, Modal, Tag } from "antd"
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

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}
const InitDepartment: Department = { name: "", attendees: [] }
let DepartmentData: Array<Department> = []
let changeData: Department = InitDepartment
function NewDepartment(Props: Init) {
  // 設定是否要顯示表單與是否更新主畫面日曆
  const { visible, setVisible, refresh, setrefresh } = Props
  // 設定所有使用者資料
  const [member, setMember] = useState<Member[]>([])
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
  // 抓取所有成員資訊
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
  // 抓取所有部門資訊
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
        DepartmentData = data
        console.log("Success", data)
      })
      .catch(error => console.log("error", error))
  }
  // 當顯示表單時抓取成員與部門資料
  useEffect(() => {
    if (visible) {
      getEmployeeInfo()
      getDepartment()
    } else {
      changeData = InitDepartment
    }
  }, [visible])
  // 顯示錯誤框
  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }
  // 關閉表單與表單初始化
  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }
  // 控制選取成員顯示方式
  function tagRender(props: any) {
    const { label, value, closable, onClose } = props

    return (
      <Tag color="gold" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    )
  }
  // 跳出確認框與確認後跟後端更新變更資料
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
  // 判斷是否變更資料有衝突
  const onFinish = (values: any) => {
    if (DepartmentData.some(temp => temp.name === changeData.name)) {
      showErrorMessage("已存在此部門")
    } else {
      showPromiseConfirm()
      console.log("finish", changeData)
    }
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form {...layout} form={form} name="control-hooks-NewDepartment" onFinish={onFinish}>
          <Form.Item name="title">
            <Row justify="start">
              <h1>新增部門</h1>
            </Row>
          </Form.Item>
          <Form.Item
            name="departmentName"
            label="Department"
            rules={[{ required: true, message: "DepartmentName is require" }]}
          >
            <Input
              allowClear
              onChange={e => {
                changeData.name = e.target.value
              }}
            />
          </Form.Item>
          <Form.Item name="attendees" label="Member" rules={[{ required: true, message: "Select Member is require" }]}>
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

export default NewDepartment
