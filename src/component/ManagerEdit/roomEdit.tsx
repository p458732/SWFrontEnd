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
import { Room, User } from "../utils/interface"

const { Option } = Select

const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
}
const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}

const { confirm } = Modal

interface Props {
  type: string
  roomList: Array<Room>
  setRoomList: React.Dispatch<React.SetStateAction<Room[]>>
  setvisible: React.Dispatch<React.SetStateAction<boolean>>
  visible?: boolean
}

const initRoom: Room = {
  name: "",
  capacity: 0,
}

function RoomEdit(props: Props) {
  const changeData: Room = { name: "", capacity: 0 }
  const { type, visible, roomList, setRoomList } = props
  const [form] = Form.useForm()
  const [selectedRoom, setSelectRoom] = useState<Room>(initRoom)
  useEffect(
    function updateFrom() {
      form.setFieldsValue({ roomName: selectedRoom.name, Capacity: selectedRoom.capacity })
      changeData.name = selectedRoom.name
      changeData.capacity = selectedRoom.capacity
      console.log("selectedRoom", selectedRoom)
      console.log("changeData", changeData)
    },
    [selectedRoom]
  )

  // const [roomList, setRoomList] = useState<Array<Room>>(fakedata)
  useEffect(
    function showChangedRoomlist() {
      form.setFieldsValue({ select: selectedRoom.name })
    },
    [roomList]
  )
  const isVisible = props.visible
  const setIsVisible = props.setvisible

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
      content: "確定要變更房間資訊嗎?",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        })
          .then(() => {
            let name: string = ""
            if (type === "Save")
              setRoomList(() =>
                roomList.map(room => {
                  if (room === selectedRoom) {
                    room.capacity = changeData.capacity
                    room.name = changeData.name
                    name = room.name
                  }
                  return room
                })
              )
            else if (type === "New") {
              setRoomList(() => roomList.concat(changeData))
            } else if (type === "Delete") {
              setRoomList(() => roomList.filter(room => room.name !== selectedRoom.name))
            }
            setIsVisible(false)
            setSelectRoom(initRoom)
            form.resetFields()
          })
          .catch(() => {
            showErrorMessage("變更失敗!")
          })
      },
      onCancel() {},
    })
  }

  const onFinish = (values: any) => {
    if (changeData.name === "") showErrorMessage("尚未輸入房間名稱!")
    else if (changeData.capacity === 0) showErrorMessage("尚未輸入房間可容量人數!")
    else if (
      changeData.name !== selectedRoom.name ||
      changeData.capacity !== selectedRoom.capacity ||
      type === "Delete"
    )
      showPromiseConfirm()
    else showErrorMessage("尚未變更!")
    console.log(values)
  }

  const onFinishFailed = () => {
    showErrorMessage("請選擇房間!")
    console.log("error")
  }

  const onCancel = () => {
    setIsVisible(false)
    setSelectRoom(initRoom)
    form.resetFields()
  }

  const onSelectRoom = (value: string) => {
    console.log(selectedRoom)
    roomList.forEach(item => {
      if (item.name === value) {
        console.log("item", item)
        setSelectRoom(item)
      }
    })
  }

  function changeRoomName(e: React.ChangeEvent<HTMLInputElement>) {
    changeData.name = e.target.value
    console.log(changeData)
  }

  function changeRoomCapacity(value: number | string | undefined) {
    if (value !== undefined) changeData.capacity = Number(value)
    console.log(changeData)
  }

  function limitDecimals(value: number | string | undefined) {
    if (value !== undefined) return String(value).replace(/^(0+)|[^\d]+/g, "")
    return ""
  }

  return (
    <Modal visible={isVisible} okText={type} onCancel={onCancel} footer={false}>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row justify="center">
          <h1>{type === "New" ? "新增房間" : "變更房間"}</h1>
        </Row>
        <Form.Item
          name="select"
          label="Select room"
          rules={[{ required: type !== "New", message: "Select room is require" }]}
          hasFeedback
          hidden={type === "New"}
        >
          <Select showSearch placeholder="Select a room" onChange={onSelectRoom} allowClear>
            {roomList.map(item => (
              <Option value={item.name} key={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="roomName" name="roomName">
          <Input readOnly={type === "delete"} onChange={changeRoomName} type="text" />
        </Form.Item>
        <Form.Item label="Capacity" name="Capacity">
          <InputNumber
            readOnly={type === "delete"}
            onChange={changeRoomCapacity}
            type="text"
            formatter={limitDecimals}
            parser={limitDecimals}
            min={0}
            max={1000}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space size="middle">
            <Button onClick={onCancel} type="default">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" danger={type === "Delete"}>
              {type}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

RoomEdit.defaultProps = {
  visible: true,
}

export default RoomEdit
