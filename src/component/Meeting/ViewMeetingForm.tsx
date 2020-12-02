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
import { EnvironmentOutlined, FontSizeOutlined } from "@ant-design/icons"
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

import moment from "moment"
import { Room, User, Department, Meeting } from "../utils/interface"

const { TextArea } = Input

const tailLayout = {
  wrapperCol: { offset: 18, span: 16 },
}

const SelectLayout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { offset: 0, span: 16 },
}

const SwitchLayout = {
  labelCol: { span: 8, offset: 0 },
  wrapperCol: { offset: 0, span: 16 },
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
  title: string
  description: string
  roomName: string
}

const MeetingData: Meeting = {
  meetingID: 0,
  title: "string",
  description: "string",
  departments: ["IE"],
  location: "TR-302",
  repeatType: 0,
  creatorUid: 0,
  fromDate: "2020-12-02T07:54:36.799Z",
  toDate: "2020-12-02T07:54:36.799Z",
}

const member = [
  { name: "gold", uid: 0, email: "aaaa" },
  { name: "lime", uid: 1, email: "bbbb" },
  { name: "green", uid: 2, email: "cccc" },
  { name: "cyan", uid: 3, email: "dddd" },
  { name: "gold", uid: 4, email: "ffff" },
  { name: "111", uid: 5, email: "gggg" },
  { name: "33", uid: 6, email: "hhhh" },
]

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  type: "Edit" | "View"
  meetingValue?: Meeting
}

function ViewMeetingForm(Props: Init) {
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [modalText, setModalText] = React.useState("Content of the modal")
  const { visible, setVisible, type } = Props
  const [form] = Form.useForm()
  const typeBool = type === "Edit"

  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
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

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds")
    setConfirmLoading(true)
    setTimeout(() => {
      setVisible(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }

  const onFinish = (values: any) => {}

  const onFinishFailed = () => {
    showErrorMessage("請選擇日期!")
    console.log("error")
  }

  return (
    <>
      <Modal visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel} footer={false}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            descript: MeetingData.description,
            meetingRoom: roomList[0].name,
            allDay: true,
            repeat: true,
            department: departmentList[0].name,
            titleName: MeetingData.title,
            member: "aaaa\nbbbb\nrrrr\nddddd",
            selectDate: `From  ${moment().format("YYYY-MM-DD HH:mm")}  to  ${moment("2020-12-02T07:54:36.799Z").format(
              "YYYY-MM-DD HH:mm"
            )}`,
          }}
        >
          <Form.Item name="title">
            <Row justify="start">
              <h1> {MeetingData.title}</h1>
            </Row>
          </Form.Item>
          <Row>
            <Col span={8} offset={2}>
              <Form.Item name="allDay" label="All Day" {...SwitchLayout} valuePropName="checked">
                <Switch disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="repeat" label="Repeat" {...SwitchLayout} valuePropName="checked">
                <Switch disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="selectDate" label="Select Date">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="meetingRoom" label="Meeting Room" {...SelectLayout}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name="department" label="Department" {...SelectLayout}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name="member" label="Member">
            <TextArea allowClear placeholder="Descript" autoSize={{ minRows: 3, maxRows: 5 }} readOnly />
          </Form.Item>
          <Form.Item name="descript" label="Descript">
            <TextArea allowClear placeholder="Descript" autoSize={{ minRows: 3, maxRows: 5 }} readOnly />
          </Form.Item>
          <Form.Item name="button" {...tailLayout}>
            <Button onClick={handleCancel} type="default">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

ViewMeetingForm.defaultProps = {
  visible: true,
  type: "Edit",
}

export default ViewMeetingForm
