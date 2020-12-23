/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "antd"
import React, { useState } from "react"
import { Meeting } from "../component/utils/interface"
import ManagerEdit from "../component/ManagerEdit/ManagerEdit"
import NewMeetingForm from "../component/Meeting/NewMeetingForm"
import ViewMeetingForm from "../component/Meeting/ViewMeetingForm"
import MeetingForm from "../component/Meeting/MeetingForm"

const MeetingData: Meeting = {
  meetingID: 16,
  creatorUid: 0,
  title: "123",
  description: "422",
  departments: ["IE"],
  attendees: [6, 13],
  location: "TR-305",
  repeatType: 0,
  fromDate: "2020-11-30T17:17:57",
  toDate: "2020-12-10T17:17:57",
}

export default function Home() {
  const [ViewMeetingFromVisible, setViewMeetingFromVisible] = React.useState(false)
  const [NewMeetingFromVisible, setNewMeetingFromVisible] = React.useState(false)
  const [EditMeetingFromVisible, setEditMeetingFromVisible] = React.useState(false)

  return (
    <div>
      <ManagerEdit />
      <Button
        type="primary"
        onClick={() => {
          setViewMeetingFromVisible(true)
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
      <Button
        type="primary"
        onClick={() => {
          setEditMeetingFromVisible(true)
        }}
      >
        EditMeet
      </Button>
      <ViewMeetingForm
        visible={ViewMeetingFromVisible}
        setVisible={setViewMeetingFromVisible}
        meetingData={MeetingData}
      />
      <NewMeetingForm visible={NewMeetingFromVisible} setVisible={setNewMeetingFromVisible} />
      <MeetingForm visible={EditMeetingFromVisible} setVisible={setEditMeetingFromVisible} meetingData={MeetingData} />
    </div>
  )
}
