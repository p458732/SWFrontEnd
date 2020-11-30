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
} from "antd"
import moment from "moment"
import { Room, User, Meeting } from "../utils/interface"

const { RangePicker } = DatePicker

const { Option } = Select

const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
}
const SwitchLayout = {
  labelCol: { span: 8, offset: 0 },
  wrapperCol: { offset: 0, span: 16 },
}
const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  meetingValue?: Meeting
}

function MeetingForm(Props: Init) {
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [modalText, setModalText] = React.useState("Content of the modal")
  const { visible, setVisible } = Props
  const [form] = Form.useForm()

  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
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
    showErrorMessage("請選擇房間!")
    console.log("error")
  }

  function onChange(dates: any, dateStrings: any) {
    if (dates === null || dateStrings === null) return
    console.log("From: ", dates[0], ", to: ", dates[1])
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1])
  }

  return (
    <>
      <Modal visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row justify="start">
            <h1>Title</h1>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="All Day" {...SwitchLayout}>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Repeat" {...SwitchLayout}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                "This Month": [moment().startOf("month"), moment().endOf("month")],
              }}
              showTime
              format="YYYY/MM/DD HH:mm"
              onChange={onChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MeetingForm
