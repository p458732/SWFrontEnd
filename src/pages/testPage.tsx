/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "antd"
import React, { useState } from "react"
import { Meeting } from "../component/utils/interface"
import Edit from "../component/ManagerEdit/Edit"
import ManagerEdit from "../component/ManagerEdit/ManagerEdit"
import MeetingForm from "../component/Meeting/MeetingForm"


export default function Home() {
  const [MeetingFromVisible, setMeetingFromVisible] = React.useState(false)
  const showModal = () => {
    setMeetingFromVisible(true)
  }
  const InitData: any = {
    visible: MeetingFromVisible,
    setVisible: setMeetingFromVisible,
    meetingValue: null,
  }
  return (
    <div>
     
      <ManagerEdit />
      <Button type="primary" onClick={showModal}>
        Open Modal with async logic
      </Button>
      <MeetingForm visible={MeetingFromVisible} setVisible={setMeetingFromVisible} />
      <Edit />
    </div>
  )
}
