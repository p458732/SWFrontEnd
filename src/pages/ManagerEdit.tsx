import React from "react"
import Edit from "../component/ManagerEdit/Edit"
import RoomEdit from "../component/ManagerEdit/roomEdit"

export default function Home() {
  return (
    <div>
      <Edit />
      <RoomEdit name="test" />
    </div>
  )
}
