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
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Form, Input, Button, Select, InputNumber, Space, Row, Modal } from "antd"
import { Member, Department, header, Room, User } from "../utils/interface"

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
  setvisible: React.Dispatch<React.SetStateAction<boolean>>
  visible?: boolean
}

const initRoom: Room = {
  name: "",
  capacity: 0,
  id: -1,
}

function RoomEdit(props: Props) {
  const changeData: Room = { name: "", capacity: 0, id: -1 }
  const { type, visible } = props
  const [roomList, setRoomList] = useState<Array<Room>>([])
  const [form] = Form.useForm()
  const [selectedRoom, setSelectRoom] = useState<Room>(initRoom)
  useEffect(
    function updateFrom() {
      form.setFieldsValue({ roomName: selectedRoom.name, Capacity: selectedRoom.capacity })
      changeData.name = selectedRoom.name
      changeData.capacity = selectedRoom.capacity
      changeData.id = selectedRoom.id
      console.log("selectedRoom", selectedRoom)
      console.log("changeData", changeData)
    },
    [selectedRoom]
  )

  useEffect(() => {
    if (!visible) return
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
  }, [visible])

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

  function Choose(): Promise<Response> {
    let choose: Promise<Response>
    if (type === "New") {
      choose = fetch("https://hw.seabao.ml/api/room", {
        method: "POST", // or 'PUT'
        body: JSON.stringify({ name: changeData.name, capacity: changeData.capacity }), // data can be `string` or {object}!
        headers: header,
      })
    } else if (type === "Delete") {
      choose = fetch(`https://hw.seabao.ml/api/room?roomName=${changeData.name}`, {
        method: "DELETE",
        headers: header,
      })
    } else {
      choose = fetch(`https://hw.seabao.ml/api/room/${changeData.id}?capacity=${changeData.capacity}`, {
        method: "PATCH",
        headers: header,
      })
    }
    return choose
  }

  function showPromiseConfirm() {
    const judgecontent = type === "New" ? "新增" : "變更"
    const Content = `確定要${judgecontent}此房間嗎?`
    confirm({
      title: "確認",
      icon: <ExclamationCircleOutlined />,
      content: Content,
      onOk() {
        Choose()
          .then(() => {
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
    ) {
      if (type === "New" && roomList.some(room => room.name === changeData.name)) {
        showErrorMessage("房間已存在!")
        return
      }
      showPromiseConfirm()
    } else showErrorMessage("尚未變更!")
  }

  const onCancel = () => {
    setIsVisible(false)
    setSelectRoom(initRoom)
    form.resetFields()
  }

  const onSelectRoom = (value: string) => {
    console.log(selectedRoom)
    if (value === undefined) form.resetFields()
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
    <Modal visible={isVisible} okText={type} onCancel={onCancel} footer={false} forceRender>
      <Form {...layout} form={form} name={`control-hooks-roomEdit ${type}`} onFinish={onFinish}>
        <Row justify="center">
          <h1>{type === "New" ? "新增房間" : "變更房間"}</h1>
        </Row>
        <Form.Item
          name="select"
          label="Select room"
          rules={[{ required: type !== "New", message: "Select room is require" }]}
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
        <Form.Item
          label="Room name"
          name="roomName"
          rules={[{ required: type === "New", message: "Room name is require" }]}
        >
          <Input readOnly={type !== "New"} onChange={changeRoomName} type="text" />
        </Form.Item>
        <Form.Item
          label="Capacity"
          name="Capacity"
          rules={[{ required: type === "New", message: "Capacity is require" }]}
        >
          <InputNumber
            readOnly={type === "Delete"}
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
