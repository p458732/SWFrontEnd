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
interface Init {
  setrefresh: React.Dispatch<React.SetStateAction<boolean>>
  refresh: boolean
}
export default function ManagerEdit(Props: Init) {
  const { refresh, setrefresh } = Props
  const [visible, setVisible] = useState(false)
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
          if (lock) return
          setVisible(false)
          setSaveEditFormVsible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setNewEditFormVsible(true)
        }}
      >
        New
      </Button>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setDeleteEditFormVsible(true)
        }}
      >
        Delete
      </Button>
      <h4 style={{ padding: "5px" }}>EmployeeEdit</h4>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setEmployeeEditVisible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setEmployeeDeleteVisible(true)
        }}
      >
        Delete
      </Button>
      <h4 style={{ padding: "5px" }}>DepartmentEdit</h4>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setEditDepartmentVisible(true)
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setNewDepartmentVisible(true)
        }}
      >
        New
      </Button>
      <Button
        onClick={() => {
          if (lock) return
          setVisible(false)
          setDeleteDepartmentVisible(true)
        }}
      >
        Delete
      </Button>
    </div>
  )
  return (
    <>
      <Popover
        content={content}
        placement="bottomLeft"
        trigger="hover"
        visible={visible}
        onVisibleChange={(vis: boolean) => {
          setVisible(vis)
        }}
      >
        <Button icon={<EditFilled style={{ fontSize: "28px" }} />} style={{ width: 60, height: 60 }} />
      </Popover>

      <RoomEdit
        type="Save"
        setvisible={setSaveEditFormVsible}
        visible={editSaveFormVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <RoomEdit
        type="New"
        setvisible={setNewEditFormVsible}
        visible={editNewFormVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <RoomEdit
        type="Delete"
        setvisible={setDeleteEditFormVsible}
        visible={editDeleteFormVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <EmployeeEdit
        setVisible={setEmployeeEditVisible}
        visible={editEmployeeEditVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <EmployeeDelete
        setVisible={setEmployeeDeleteVisible}
        visible={editEmployeeDeleteVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <NewDepartment
        setVisible={setNewDepartmentVisible}
        visible={editNewDepartmentVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <DeleteDepartment
        setVisible={setDeleteDepartmentVisible}
        visible={editDeleteDepartmentVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
      <EditDepartment
        setVisible={setEditDepartmentVisible}
        visible={editEditDepartmentVisible}
        refresh={refresh}
        setrefresh={setrefresh}
      />
    </>
  )
}
