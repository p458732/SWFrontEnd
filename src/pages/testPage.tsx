/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "antd"
import React, { useState } from "react"
import { Meeting } from "../component/utils/interface"
import ManagerEdit from "../component/ManagerEdit/ManagerEdit"
import NewMeetingForm from "../component/Meeting/NewMeetingForm"
import ViewMeetingForm from "../component/Meeting/ViewMeetingForm"

const MeetingData: Meeting = {
  meetingID: 13,
  creatorUid: 0,
  title: "123",
  description: "string",
  departments: ["EE"],
  attendees: [15, 16, 18, 20],
  location: "TR-305",
  repeatType: 0,
  fromDate: "2020-12-16T17:10:04",
  toDate: "2020-12-23T17:10:04",
}

export default function Home() {
  const [ViewMeetingFromVisible, setViewMeetingFromVisible] = React.useState(false)
  const [NewMeetingFromVisible, setNewMeetingFromVisible] = React.useState(false)

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
      <ViewMeetingForm
        visible={ViewMeetingFromVisible}
        setVisible={setViewMeetingFromVisible}
        meetingData={MeetingData}
      />
      <NewMeetingForm visible={NewMeetingFromVisible} setVisible={setNewMeetingFromVisible} />
    </div>
  )
}
