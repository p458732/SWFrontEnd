/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import "antd/dist/antd.css"
import "./Edit.css"
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
import { Room } from "../utils/interface"

const { Option } = Select

const tailLayout = {
  wrapperCol: { offset: 14, span: 16 },
}
const layout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 16 },
}

const { confirm } = Modal

interface Mystate {
  selectedRoom: Room
  roomList: Array<Room>
}

interface Props {
  type: string
}

class RoomEdit extends React.Component<Props, Mystate> {
  formRef = React.createRef<FormInstance>()

  constructor(props: any) {
    super(props)
    this.state = {
      selectedRoom: {
        name: "",
        capacity: 0,
      },
      roomList: [
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
      ],
    }
  }

  onFinish = (values: any) => {
    console.log(values)
  }

  onSave = () => {
    this.showPromiseConfirm()
  }

  onCancel = () => {}

  onSelectRoom = (value: string) => {
    this.state.roomList.forEach(item => {
      if (item.name === value) {
        this.setState({ selectedRoom: item })
      }
    })
  }

  showPromiseConfirm = () => {
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: "確定要變更房間資訊嗎?",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        }).catch(() => console.log("Oops errors!"))
      },
      onCancel() {},
    })
  }

  render() {
    return (
      <div className="smallbox">
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
        >
          <Row justify="center">
            <h1>From</h1>
          </Row>
          <Form.Item
            name="select"
            label="Select room"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select a room"
              onChange={this.onSelectRoom}
              allowClear
            >
              {this.state.roomList.map(item => (
                <Option value={item.name} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="roomName">
            <span className="ant-form-text">
              {this.state.selectedRoom.name}
            </span>
          </Form.Item>
          <Form.Item label="Capacity">
            <span className="ant-form-text">
              {this.state.selectedRoom.capacity <= 0
                ? ""
                : this.state.selectedRoom.capacity}
            </span>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space size="middle">
              <Button onClick={this.onCancel} type="default">
                Cancel
              </Button>
              <Button onClick={this.onSave} type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default RoomEdit
