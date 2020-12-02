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
  title: string
  description: string
  roomName: string
}

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  meetingData: Meeting
}

function ViewMeetingForm(Props: Init) {
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const { visible, setVisible, meetingData } = Props
  const [form] = Form.useForm()

  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }

  const fromDate = moment(meetingData.fromDate) //
  const toDate = moment(meetingData.toDate) //

  function judgeAllday() {
    if (fromDate.isSame(toDate, "day") && toDate.diff(fromDate, "hour") >= 23) return true
    return false
  }

  return (
    <>
      <Modal visible={visible} confirmLoading={confirmLoading} onCancel={handleCancel} footer={false}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          initialValues={{
            descript: meetingData.description,
            meetingRoom: meetingData.location,
            allDay: judgeAllday(),
            repeat: meetingData.repeatType,
            department: meetingData.departments.join("\n"),
            titleName: meetingData.title,
            member: meetingData.attendees?.filter(element => `${element.name} <${element.email}>`).join("\n"),
            selectDate: `From  ${fromDate.format("YYYY-MM-DD HH:mm")}  to  ${toDate.format("YYYY-MM-DD HH:mm")}`,
          }}
        >
          <Row justify="center">
            <h1> {`${meetingData.title}`}</h1>
          </Row>
          <Row>
            <Col span={8} offset={3}>
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
            <TextArea allowClear placeholder="Department" autoSize={{ minRows: 1, maxRows: 3 }} readOnly />
          </Form.Item>
          <Form.Item name="member" label="Member">
            <TextArea allowClear placeholder="Member" autoSize={{ minRows: 3, maxRows: 5 }} readOnly />
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
}

export default ViewMeetingForm
