import { Button } from "antd"
import React, { useState } from "react"
import RoomEdit from "./roomEdit"
import { Room } from "../utils/interface"
import EmployeeEdit from "./EmployeeEdit"
import EmployeeDelete from "./EmployeeDelete"

const fakedata = [
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
export default function ManagerEdit() {
  const [roomList, setroomList] = useState<Array<Room>>(fakedata)
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false)
  const [editNewFormVisible, setNewEditFormVsible] = useState(false)
  const [editDeleteFormVisible, setDeleteEditFormVsible] = useState(false)
  const [editEmployeeEditVisible, setEmployeeEditVisible] = useState(false)
  const [editEmployeeDeleteVisible, setEmployeeDeleteVisible] = useState(false)

  return (
    <>
      <div>
        <Button
          onClick={() => {
            setSaveEditFormVsible(true)
          }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            setNewEditFormVsible(true)
          }}
        >
          New
        </Button>
        <Button
          onClick={() => {
            setDeleteEditFormVsible(true)
          }}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            setEmployeeEditVisible(true)
          }}
        >
          EmployeeEdit
        </Button>
        <Button
          onClick={() => {
            setEmployeeDeleteVisible(true)
          }}
        >
          EmployeeDelete
        </Button>
      </div>
      <RoomEdit
        type="Save"
        roomList={roomList}
        setRoomList={setroomList}
        setvisible={setSaveEditFormVsible}
        visible={editSaveFormVisible}
      />
      <RoomEdit
        type="New"
        roomList={roomList}
        setRoomList={setroomList}
        setvisible={setNewEditFormVsible}
        visible={editNewFormVisible}
      />
      <RoomEdit
        type="Delete"
        roomList={roomList}
        setRoomList={setroomList}
        setvisible={setDeleteEditFormVsible}
        visible={editDeleteFormVisible}
      />
      <EmployeeEdit setVisible={setEmployeeEditVisible} visible={editEmployeeEditVisible} />
      <EmployeeDelete setVisible={setEmployeeDeleteVisible} visible={editEmployeeDeleteVisible} />
    </>
  )
}
