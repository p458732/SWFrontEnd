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
import { Form, Input, Button, Switch, Row, Col, Modal, Tag } from "antd"

import moment from "moment"
import { Meeting, Member } from "../utils/interface"

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

interface Init {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
  meetingData: Meeting
}
function ViewMeetingForm(Props: Init) {
  // 設定是否要顯示表單與會議資料
  const { visible, setVisible, meetingData } = Props
  // 設定所有成員資訊
  const [member, setMember] = useState<Member[]>([])
  // 使用者token
  const token = useSelector((state: any) => state.tokenReducer)
  // 後端連線所需的設定
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  // 表單控制
  const [form] = Form.useForm()
  // 關閉表單與表單初始化
  const handleCancel = () => {
    console.log("Clicked cancel button")
    form.resetFields()
    setVisible(false)
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
  // 顯示表單時抓取成員資訊
  // 關閉表單時初始化表單
  useEffect(() => {
    if (visible) getEmployeeInfo()
    else {
      form.resetFields()
      console.log("reset")
    }
  }, [visible])
  // 設定表單成員列表顯示項
  useEffect(() => {
    form.setFieldsValue({
      member: meetingData.attendees
        ?.map(element => {
          const User = member.find(user => user.id === element)
          if (User !== undefined) return `${User.name} <${User.email}>`
          return ""
        })
        .join("\n"),
    })
  }, [member])
  // 當會議變更時更新表單
  useEffect(() => form.resetFields(), [meetingData])
  // 轉化會議日期型態以利顯示
  const fromDate = moment(meetingData.fromDate) //
  const toDate = moment(meetingData.toDate) //
  console.log(fromDate, toDate)

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={false}>
        <Form
          {...layout}
          form={form}
          name="control-hooks-viewMetting"
          initialValues={{
            descript: meetingData.description,
            meetingRoom: meetingData.location,
            // todo
            // repeat: meetingData.repeatType,
            // todo
            // department: meetingData.departments.join("\n"),
            department: meetingData.departments,
            repeat: meetingData.repeatType,
            titleName: meetingData.title,
            selectDate: `From  ${fromDate.format("YYYY-MM-DD HH:mm")}  to  ${toDate.format("YYYY-MM-DD HH:mm")}`,
          }}
        >
          <Row justify="center">
            <h1> {`${meetingData.title}`}</h1>
          </Row>
          <Form.Item name="selectDate" label="Select Date">
            <Input readOnly />
          </Form.Item>
          <Row>
            <Col span={8} offset={3}>
              <Form.Item name="repeat" label="Repeat" {...SwitchLayout} valuePropName="checked">
                <Switch disabled />
              </Form.Item>
            </Col>
          </Row>

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

export default ViewMeetingForm
