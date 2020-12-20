import { Button, Popover } from "antd"
import React, { useState } from "react"
import RoomEdit from "./roomEdit"
import EmployeeEdit from "./EmployeeEdit"
import EmployeeDelete from "./EmployeeDelete"

export default function ManagerEdit() {
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false)
  const [editNewFormVisible, setNewEditFormVsible] = useState(false)
  const [editDeleteFormVisible, setDeleteEditFormVsible] = useState(false)
  const [editEmployeeEditVisible, setEmployeeEditVisible] = useState(false)
  const [editEmployeeDeleteVisible, setEmployeeDeleteVisible] = useState(false)

  const content = (
    <div>
      <h4 style={{ padding: "5px" }}>RoomEdit</h4>
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
      <h4 style={{ padding: "5px" }}>EmployeeEdit</h4>
      <Button
        onClick={() => {
          setEmployeeEditVisible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          setEmployeeDeleteVisible(true)
        }}
      >
        Delete
      </Button>
    </div>
  )
  return (
    <>
      <Popover content={content}>
        <Button type="primary">ManagerEdit</Button>
      </Popover>

      <RoomEdit type="Save" setvisible={setSaveEditFormVsible} visible={editSaveFormVisible} />
      <RoomEdit type="New" setvisible={setNewEditFormVsible} visible={editNewFormVisible} />
      <RoomEdit type="Delete" setvisible={setDeleteEditFormVsible} visible={editDeleteFormVisible} />
      <EmployeeEdit setVisible={setEmployeeEditVisible} visible={editEmployeeEditVisible} />
      <EmployeeDelete setVisible={setEmployeeDeleteVisible} visible={editEmployeeDeleteVisible} />
    </>
  )
}
