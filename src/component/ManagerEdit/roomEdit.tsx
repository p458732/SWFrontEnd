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
import "./Edit.css"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Form, Input, Button, Select, InputNumber, Space, Row, Modal } from "antd"
import { Room } from "../utils/interface"

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
  visible: boolean
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}

const initRoom: Room = {
  name: "",
  capacity: 0,
  id: -1,
}

function RoomEdit(props: Props) {
  const changeData: Room = { name: "", capacity: 0, id: -1 }
  // 設定表單屬性、是否要顯示表單與是否更新主畫面日曆
  const { type, visible, refresh, setrefresh } = props
  // 設定房間列表資訊
  const [roomList, setRoomList] = useState<Array<Room>>([])
  // 控制表單
  const [form] = Form.useForm()
  // 設定使用者所選取到的房間
  const [selectedRoom, setSelectRoom] = useState<Room>(initRoom)
  // 使用者token
  const token = useSelector((state: any) => state.tokenReducer)
  // 與後端連線所需的設定
  const header: Headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
  // 當選取房間後自動帶入房間資訊至表單
  useEffect(
    function updateFrom() {
      form.setFieldsValue({ roomName: selectedRoom.name, Capacity: selectedRoom.capacity })
      changeData.name = selectedRoom.name
      changeData.capacity = selectedRoom.capacity
      changeData.id = selectedRoom.id
    },
    [selectedRoom]
  )
  // 顯示表單時抓取所有房間資訊
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

  // 抓取到所有房間資訊後更新表單房間列表選項
  useEffect(
    function showChangedRoomlist() {
      form.setFieldsValue({ select: selectedRoom.name })
    },
    [roomList]
  )
  // 控制表單是否顯示
  const isVisible = props.visible
  const setIsVisible = props.setvisible
  // 跳出錯誤框
  function showErrorMessage(message: string) {
    Modal.error({
      title: "Error",
      content: message,
    })
  }
  // 判斷表單類型後控制與後端更新的方式
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
  // 跳出確認框與確認後跟後端更新變更資料
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
            setrefresh(!refresh)
          })
          .catch(() => {
            showErrorMessage("變更失敗!")
          })
      },
      onCancel() {},
    })
  }
  // 判斷是否輸入正確或是有無變更
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
  // 關閉表單、初始化表單與selectRoom
  const onCancel = () => {
    setIsVisible(false)
    setSelectRoom(initRoom)
    form.resetFields()
  }
  // 使用者選擇房間後自動帶入房間資訊至表單
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
  // 設定表單所抓取到變更房間的資訊
  function changeRoomName(e: React.ChangeEvent<HTMLInputElement>) {
    changeData.name = e.target.value
    console.log(changeData)
  }
  // 設定表單所抓取到變更房間人數容量的資訊
  function changeRoomCapacity(value: number | string | undefined) {
    if (value !== undefined) changeData.capacity = Number(value)
    console.log(changeData)
  }
  // 設定房間容量只能1~1000
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

export default RoomEdit
