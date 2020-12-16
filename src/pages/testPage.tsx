/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "antd"
import React, { useState } from "react"
import { Meeting } from "../component/utils/interface"
import Edit from "../component/ManagerEdit/Edit"
import ManagerEdit from "../component/ManagerEdit/ManagerEdit"
import MeetingForm from "../component/Meeting/MeetingForm"
import NewMeetingForm from "../component/Meeting/NewMeetingForm"
import ViewMeetingForm from "../component/Meeting/ViewMeetingForm"

const MeetingData: Meeting = {
  meetingID: 0,
  title: "78軟體工程",
  description: "心累阿",
  departments: ["IE", "CSIE"],
  location: "TR-302",
  repeatType: 0,
  creatorUid: 0,
  fromDate: "2020-12-02 00:00",
  toDate: "2020-12-02 23:59",
}

export default function Home() {
  const [MeetingFromVisible, setMeetingFromVisible] = React.useState(false)
  const [NewMeetingFromVisible, setNewMeetingFromVisible] = React.useState(false)

  const InitData: any = {
    visible: MeetingFromVisible,
    setVisible: setMeetingFromVisible,
    meetingValue: null,
  }
  return (
    <div>
      <ManagerEdit />
      <Button
        type="primary"
        onClick={() => {
          setMeetingFromVisible(true)
        }}
      >
        viewMeet
      </Button>
      <Button
        type="primary"
        onClick={() => {
          setNewMeetingFromVisible(true)
        }}
      >
        newMeet
      </Button>
      <ViewMeetingForm visible={MeetingFromVisible} setVisible={setMeetingFromVisible} meetingData={MeetingData} />
      <NewMeetingForm visible={NewMeetingFromVisible} setVisible={setNewMeetingFromVisible} />
    </div>
  )
}
