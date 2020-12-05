/* eslint-disable prefer-destructuring */
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
import { ExclamationCircleOutlined } from "@ant-design/icons"
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
import { SelectValue } from "antd/lib/select"
import moment from "moment"
import Avatar from "antd/lib/avatar/avatar"
import { connect } from "http2"
import { Content } from "antd/lib/layout/layout"
import { Room, User, Department, Meeting } from "../utils/interface"

const { TextArea } = Input

const { RangePicker } = DatePicker

const { Option } = Select

const { confirm } = Modal

const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
}

const SelectLayout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { offset: 0, span: 16 },
}

const SwitchLayout = {
  labelCol: { span: 8, offset: 0 },
  wrapperCol: { offset: 1, span: 16 },
}
const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}

const roomList: Array<Room> = [
  {
    name: "TR200",
    capacity: 12,
  },
  {
    name: "TR500",
    capacity: 10,
  },
  {
    name: "RB500",
    capacity: 20,
  },
]

const departmentList: Array<Department> = [
  { name: "Personnel Department" },
  { name: "Sales Department" },
  { name: "Business Office" },
]

interface Meet {
  titleName: string
  description: string
  location: string
  AllDay: number
  repeat: number
  toDate: string
  fromDate: string
  member: SelectValue
  department: string
}

const newData: Meet = {
  titleName: "",
  description: "",
  location: "",
  AllDay: 0,
  repeat: 0,
  toDate: "",
  fromDate: "",
  member: [],
  department: "",
}

const member = [
  { name: "gold", uid: 0, email: "123@gmail.com" },
  { name: "lime", uid: 1, email: "456@gmail.com" },
  { name: "green", uid: 2, email: "789@gmail.com" },
  { name: "cyan", uid: 3, email: "987@gmail.com" },
  { name: "gold", uid: 4, email: "654@gmail.com" },
  { name: "111", uid: 5, email: "321@gmail.com" },
]

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  meetingValue?: Meeting
}

function NewMeetingForm(Props: Init) {
  const { visible, setVisible } = Props
  const [form] = Form.useForm()

  const changeData: Meet = newData

  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }

  function showPromiseConfirm() {
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要新增此會議嗎?",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.1 ? resolve : reject, 1000)
        })
          .then(() => {
            form.resetFields()
            setVisible(false)
          })
          .catch(() => {
            showErrorMessage("變更失敗!")
          })
      },
      onCancel() {},
    })
  }

  function tagRender(props: any) {
    const { label, value, closable, onClose } = props

    return (
      <Tag color="gold" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    )
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }

  const onFinish = (values: any) => {
    showPromiseConfirm()
    console.log("finish", changeData)
  }

  const onFinishFailed = () => {
    console.log("error")
  }

  function onChangeDate(dates: any, dateStrings: any) {
    if (dates === null || dateStrings === null) return
    changeData.fromDate = dates[0].format()
    changeData.toDate = dates[1].format()
    console.log("From: ", changeData.fromDate, ", to: ", changeData.toDate)
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item name="title">
            <Row justify="start">
              <h1> 新增會議</h1>
            </Row>
          </Form.Item>
          <Form.Item name="titleName" label="Title name" rules={[{ required: true, message: "Title name is require" }]}>
            <Input
              allowClear
              onChange={e => {
                changeData.titleName = e.target.value
              }}
            />
          </Form.Item>
          <Row>
            <Col span={8} offset={3}>
              <Form.Item name="allDay" label="All Day" {...SwitchLayout} valuePropName="checked">
                <Switch
                  onChange={checked => {
                    changeData.AllDay = checked ? 1 : 0
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="repeat" label="Repeat" {...SwitchLayout} valuePropName="checked">
                <Switch
                  onChange={checked => {
                    changeData.repeat = checked ? 1 : 0
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="selectDate"
            label="Select Date"
            rules={[{ required: true, message: "Select Date is require" }]}
          >
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                "This Month": [moment().startOf("month"), moment().endOf("month")],
              }}
              disabled={!true}
              showTime
              format="YYYY/MM/DD HH:mm"
              onChange={onChangeDate}
            />
          </Form.Item>
          <Form.Item
            name="meetingRoom"
            label="Meeting Room"
            {...SelectLayout}
            rules={[{ required: true, message: "Select room is require" }]}
          >
            <Select
              showSearch
              placeholder="Select a room"
              onChange={value => {
                changeData.location = String(value)
              }}
              allowClear
            >
              {roomList.map(item => (
                <Option value={item.name} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            {...SelectLayout}
            rules={[{ required: true, message: "Select department is require" }]}
          >
            <Select
              showSearch
              placeholder="Select a room"
              onChange={value => {
                changeData.department = String(value)
                console.log(changeData.department)
              }}
              allowClear
            >
              {departmentList.map(item => (
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
              onChange={(value: SelectValue) => {
                changeData.member = value
              }}
            >
              {member.map(item => (
                <Option value={item.email} key={item.uid}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="descript" label="Descript">
            <TextArea
              allowClear
              placeholder="Descript"
              autoSize={{ minRows: 3, maxRows: 5 }}
              onChange={e => {
                changeData.description = e.target.value
              }}
            />
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

NewMeetingForm.defaultProps = {
  visible: true,
}

export default NewMeetingForm
