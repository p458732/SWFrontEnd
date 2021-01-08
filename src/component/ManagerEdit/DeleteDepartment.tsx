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
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}
let Employee: Member[] = []
function DeleteDepartment(Props: Init) {
  // 設定是否要顯示表單與是否更新主畫面日曆
  const { visible, setVisible, refresh, setrefresh } = Props
  // 設定使用者所選到的部門
  const [department, setDepartment] = useState<Department>()
  // 設定後端回傳的所有部門資訊，以利刷新表單部門顯示選項
  const [DepartmentList, setDepartmentList] = useState<Department[]>([])
  // 抓取使用者token
  const token = useSelector((state: any) => state.tokenReducer)
  // 與後端連線所需的設定
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  // 控制表單
  const [form] = Form.useForm()

  // 取得所有使用者資訊
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

  // 取得所有部門資訊
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

  // 當選取部門後自動填入部門成員至表單
  useEffect(() => {
    getEmployeeInfo().then(() => {
      const judgeData = Employee.filter(element => department?.attendees.some(judge => element.id === judge))
      console.log(judgeData)
      form.setFieldsValue({
        member: judgeData.map(element => `${element.name} <${element.email}>`).join("\n"),
      })
    })
  }, [department])

  // 當顯示表單時向後端抓取部門資訊
  useEffect(() => {
    if (visible) {
      getDepartment()
    }
  }, [visible])

  // 如有錯誤時顯示
  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }

  // 將表單關閉顯示與初始表單
  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }
  // 判斷是否要變更與按下確定後與後端變更資料
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
            setrefresh(!refresh)
            // 放changeData
          })
          .catch(() => {
            showErrorMessage("刪除失敗!")
          })
      },
      onCancel() {},
    })
  }
  // 按下表單刪除鍵時跳出確定是否刪除提示
  const onFinish = (values: any) => {
    showPromiseConfirm()
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form {...layout} form={form} name="control-hooks-DeleteDepartment" onFinish={onFinish}>
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
