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
import { Room, Member, Department, Meeting, header } from "../utils/interface"

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
  wrapperCol: { offset: 0, span: 16 },
}
const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}

const InitMeeting: Meeting = {
  title: "",
  description: "",
  location: "",
  repeatType: 0,
  toDate: "",
  fromDate: "",
  attendees: [],
  departments: [""],
}

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  meetingData: Meeting
}
let changeData: Meeting = InitMeeting
function MeetingForm(Props: Init) {
  const [member, setMember] = useState<Member[]>([])
  const [roomList, setRoomList] = useState<Array<Room>>([])
  const [DepartmentList, setDepartmentList] = useState<Department[]>([])
  const { visible, setVisible, meetingData } = Props
  const [form] = Form.useForm()

  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }

  function getRoomInfo() {
    fetch("https://hw.seabao.ml/api/room", {
      method: "GET",
      headers: header,
    })
      .then(data => data.json())
      .then(res => {
        setRoomList(res)
        console.log("Success", roomList)
      })
      .catch(error => console.log("error", error))
  }

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
      changeData = meetingData
      console.log(changeData)
      getRoomInfo()
      getDepartment()
      getEmployeeInfo()
    } else {
      changeData = InitMeeting
    }
  }, [visible])

  useEffect(() => {
    if (member.length === 0) return
    meetingData.attendees = meetingData.attendees?.map(element => {
      const User = member.find(user => user.id === element)
      if (User !== undefined) return User.email
      return ""
    })
    form.setFieldsValue({
      member: meetingData.attendees,
    })
  }, [member])

  function tagRender(props: any) {
    const { label, closable, onClose } = props

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
    changeData.attendees = num
    delete changeData.creatorUid
    console.log(changeData)
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要新增此會議嗎?",
      onOk() {
        return fetch("https://hw.seabao.ml/api/meeting", {
          method: "PATCH",
          body: JSON.stringify(changeData), // data can be `string` or {object}!
          headers: header,
        })
          .catch(() => {
            showErrorMessage("新增失敗!")
          })
          .then(res => {
            console.log("success", res)
            form.resetFields()
            setVisible(false)
            // 放changeData
          })
      },
      onCancel() {},
    })
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }

  const onFinish = (values: any) => {
    showPromiseConfirm()
    console.log("onFiniish", changeData)
  }

  const onFinishFailed = () => {
    showErrorMessage("請選擇日期!")
    console.log("error")
  }

  function onChangeDate(dates: any, dateStrings: any) {
    console.log("From: ", changeData.fromDate, ", to: ", changeData.toDate)
    if (dates === null || dateStrings === null) return
    changeData.fromDate = String(dates[0].format())
    changeData.toDate = String(dates[1].format())
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form
          {...layout}
          form={form}
          name="control-hooks-EditMeeting"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            descript: meetingData.description,
            meetingRoom: meetingData.location,
            repeat: meetingData.repeatType,
            department: meetingData.departments,
            titleName: meetingData.title,
            selectDate: [moment(meetingData.fromDate), moment(meetingData.toDate)],
          }}
        >
          <Form.Item name="title">
            <Row justify="start">
              <h1>{meetingData.title}</h1>
            </Row>
          </Form.Item>
          <Form.Item name="titleName" label="Title name" rules={[{ required: true, message: "Title name is require" }]}>
            <Input
              allowClear
              onChange={e => {
                changeData.title = e.target.value
              }}
            />
          </Form.Item>
          <Row>
            {/* { <Col span={8} offset={2}>
              <Form.Item name="allDay" label="All Day" {...SwitchLayout} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>} */}
            <Col span={8} offset={3}>
              <Form.Item name="repeat" label="Repeat" {...SwitchLayout} valuePropName="checked">
                <Switch
                  onChange={checked => {
                    changeData.repeatType = checked ? 1 : 0
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
              onChange={(value: any) => {
                changeData.location = value
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
              placeholder="Select a Department"
              onChange={value => {
                changeData.departments = [String(value)]
                console.log(changeData.departments)
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
                console.log("attendees", value)
                changeData.attendees = value
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

export default MeetingForm
