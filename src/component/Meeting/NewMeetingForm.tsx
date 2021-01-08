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
import { useSelector } from "react-redux"
import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Form, Input, Button, Select, DatePicker, Switch, Space, Row, Col, Modal, Tag } from "antd"
import moment from "moment"
import { Room, Meeting, Member } from "../utils/interface"

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

interface Department {
  name: string
  attendees: Array<any>
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
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}
const Allday: number = 0
let changeData = InitMeeting
function NewMeetingForm(Props: Init) {
  // 設定是否要顯示表單與是否更新主畫面日曆
  const { visible, setVisible, refresh, setrefresh } = Props
  // 設定所有成員資訊
  const [member, setMember] = useState<Member[]>([])
  // 設定所有房間列表
  const [roomList, setRoomList] = useState<Array<Room>>([])
  // 設定所有部門資訊
  const [DepartmentList, setDepartmentList] = useState<Department[]>([])
  // 使用者token
  const token = useSelector((state: any) => state.tokenReducer)
  // 後端連線所需要的設定
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  // 控制表單
  const [form] = Form.useForm()
  // 顯示錯誤框
  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }
  // 抓取所有房間資訊
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
        setDepartmentList(data)
        console.log("Success", data)
      })
      .catch(error => console.log("error", error))
  }
  // 顯示表單時抓取所需資訊
  // 關閉表單時初始變數值
  useEffect(() => {
    if (visible) {
      getRoomInfo()
      getDepartment()
      getEmployeeInfo()
    } else {
      changeData = InitMeeting
    }
  }, [visible])
  // 跳出確認框與確認後跟後端更新資料
  function showPromiseConfirm() {
    const num: number[] = []
    member.forEach(item => {
      if (changeData.attendees.some(email => email === item.email)) num.push(Number(item.id))
    })
    changeData.attendees = num
    console.log(changeData)
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "你確定要新增此會議嗎?",
      onOk() {
        return fetch("https://hw.seabao.ml/api/meeting", {
          method: "POST",
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
            setrefresh(!refresh)
            // 放changeData
          })
      },
      onCancel() {},
    })
  }
  // 控制表單成員顯示方式
  function tagRender(props: any) {
    const { label, value, closable, onClose } = props

    return (
      <Tag color="gold" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    )
  }
  // 關閉表單與初始化表單
  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
  }
  // 跳出確認框
  const onFinish = (values: any) => {
    showPromiseConfirm()
    console.log("finish", changeData)
  }

  function onChangeDate(dates: any, dateStrings: any) {
    if (dates === null || dateStrings === null) return
    changeData.fromDate = dates[0].toISOString()
    changeData.toDate = dates[1].toISOString()
  }

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form {...layout} form={form} name="control-hooks-NewMeeting" onFinish={onFinish} key={Math.random()}>
          <Form.Item name="title">
            <Row justify="start">
              <h1> 新增會議</h1>
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
            {/* {<Col span={8} offset={3}>
              <Form.Item name="allDay" label="All Day" {...SwitchLayout} valuePropName="checked">
                <Switch
                  onChange={checked => {
                    Allday = checked ? 1 : 0
                  }}
                />
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

NewMeetingForm.defaultProps = {
  visible: true,
}

export default NewMeetingForm
