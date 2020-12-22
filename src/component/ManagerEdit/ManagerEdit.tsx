import { Button, Popover } from "antd"
import React, { useEffect, useState } from "react"
import { EditFilled } from "@ant-design/icons"
import RoomEdit from "./roomEdit"
import EmployeeEdit from "./EmployeeEdit"
import EmployeeDelete from "./EmployeeDelete"
import NewDepartment from "./NewDepartment"
import DeleteDepartment from "./DeleteDepartment"
import EditDepartment from "./EditDepartment"

let lock = false
export default function ManagerEdit() {
  const [editSaveFormVisible, setSaveEditFormVsible] = useState(false)
  const [editNewFormVisible, setNewEditFormVsible] = useState(false)
  const [editDeleteFormVisible, setDeleteEditFormVsible] = useState(false)
  const [editEmployeeEditVisible, setEmployeeEditVisible] = useState(false)
  const [editEmployeeDeleteVisible, setEmployeeDeleteVisible] = useState(false)
  const [editNewDepartmentVisible, setNewDepartmentVisible] = useState(false)
  const [editDeleteDepartmentVisible, setDeleteDepartmentVisible] = useState(false)
  const [editEditDepartmentVisible, setEditDepartmentVisible] = useState(false)
  useEffect(() => {
    if (
      !editSaveFormVisible &&
      !editNewFormVisible &&
      !editDeleteFormVisible &&
      !editEmployeeEditVisible &&
      !editEmployeeDeleteVisible &&
      !editNewDepartmentVisible &&
      !editDeleteDepartmentVisible &&
      !editEditDepartmentVisible
    )
      lock = false
    else lock = true
  })

  const content = (
    <div>
      <h4 style={{ padding: "5px" }}>RoomEdit</h4>
      <Button
        onClick={() => {
          if (!lock) setSaveEditFormVsible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          if (!lock) setNewEditFormVsible(true)
        }}
      >
        New
      </Button>
      <Button
        onClick={() => {
          if (!lock) setDeleteEditFormVsible(true)
        }}
      >
        Delete
      </Button>
      <h4 style={{ padding: "5px" }}>EmployeeEdit</h4>
      <Button
        onClick={() => {
          if (!lock) setEmployeeEditVisible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          if (!lock) setEmployeeDeleteVisible(true)
        }}
      >
        Delete
      </Button>
      <h4 style={{ padding: "5px" }}>DepartmentEdit</h4>
      <Button
        onClick={() => {
          if (!lock) setEditDepartmentVisible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          if (!lock) setNewDepartmentVisible(true)
        }}
      >
        New
      </Button>
      <Button
        onClick={() => {
          if (!lock) setDeleteDepartmentVisible(true)
        }}
      >
        Delete
      </Button>
    </div>
  )
  return (
    <>
      <Popover content={content} placement="bottomLeft">
        <Button icon={<EditFilled />} style={{ width: 80 }} />
      </Popover>

      <RoomEdit type="Save" setvisible={setSaveEditFormVsible} visible={editSaveFormVisible} />
      <RoomEdit type="New" setvisible={setNewEditFormVsible} visible={editNewFormVisible} />
      <RoomEdit type="Delete" setvisible={setDeleteEditFormVsible} visible={editDeleteFormVisible} />
      <EmployeeEdit setVisible={setEmployeeEditVisible} visible={editEmployeeEditVisible} />
      <EmployeeDelete setVisible={setEmployeeDeleteVisible} visible={editEmployeeDeleteVisible} />
      <NewDepartment setVisible={setNewDepartmentVisible} visible={editNewDepartmentVisible} />
      <DeleteDepartment setVisible={setDeleteDepartmentVisible} visible={editDeleteDepartmentVisible} />
      <EditDepartment setVisible={setEditDepartmentVisible} visible={editEditDepartmentVisible} />
    </>
  )
}
