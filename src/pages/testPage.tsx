/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "antd"
import React, { useState } from "react"
import { gapi } from "gapi-script"
import { Meeting } from "../component/utils/interface"
import ManagerEdit from "../component/ManagerEdit/ManagerEdit"
import NewMeetingForm from "../component/Meeting/NewMeetingForm"
import ViewMeetingForm from "../component/Meeting/ViewMeetingForm"
import MeetingForm from "../component/Meeting/MeetingForm"
import GoogleCalendar from "../component/GoogleCalendar/GoogleCalendar"

// const MeetingData: Meeting = {
//   meetingID: 16,
//   creatorUid: 0,
//   title: "123",
//   description: "422",
//   departments: ["IE"],
//   attendees: [6, 13],
//   location: "TR-305",
//   repeatType: 0,
//   fromDate: "2020-11-30T17:17:57",
//   toDate: "2020-12-10T17:17:57",
// }

const CLIENT_ID = "1065980057742-m7ga9esujdi7bo6v9llc02p785kp4sca.apps.googleusercontent.com"
const API_KEY = "AIzaSyCfPa82e7-60AxvTPsX8wBclVmSTl_NIhs"

const authParams = {
  response_type: "token", // Retrieves an access token only
  client_id: CLIENT_ID, // Client ID from Cloud Console
  immediate: false, // For the demo, force the auth window every time
  scope: ["https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"], // Array of scopes
}

export default function Home() {
  const [ViewMeetingFromVisible, setViewMeetingFromVisible] = React.useState(false)
  const [NewMeetingFromVisible, setNewMeetingFromVisible] = React.useState(false)
  const [EditMeetingFromVisible, setEditMeetingFromVisible] = React.useState(false)

  function handleClientLoad() {
    console.log("handle")
    gapi.load("client:auth2", function () {
      gapi.auth2.init({ client_id: CLIENT_ID })
    })
  }

  function loadClient() {
    gapi.client.setApiKey(API_KEY)
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest").then(
      function () {
        console.log("GAPI client loaded for API")
      },
      function (err) {
        console.error("Error loading GAPI client for API", err)
      }
    )
  }

  function myCallback(authResult) {
    if (authResult && authResult.access_token) {
      gapi.auth.setToken(authResult)
      console.log(authResult)

      loadClient()
    } else {
      // Authorization failed or user declined
    }
  }

  function execute() {
    const events = [
      {
        summary: "test",
        location: "coimbatore",
        description: "https://cruelshare.com/",
        start: {
          date: "2020-12-29",
          timeZone: "Asia/Taipei",
        },
        end: {
          date: "2020-12-29",
          timeZone: "Asia/Taipei",
        },
      },
      {
        summary: "test2",
        location: "coimbatore",
        description: "https://boardgamehot.com/",
        start: {
          date: "2020-12-28",
          timeZone: "Asia/Taipei",
        },
        end: {
          date: "2020-12-28",
          timeZone: "Asia/Taipei",
        },
      },
    ]

    // 多筆事件
    const batch = gapi.client.newBatch()
    events.map((r, j) => {
      batch.add(
        gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: events[j],
        })
      )
    })

    batch.then(function () {
      console.log("all jobs now dynamically done!!!")
    })
  }

  const MeetingData: Meeting[] = [
    {
      meetingID: 16,
      creatorUid: 0,
      title: "123",
      description: "422",
      departments: ["IE"],
      attendees: [6, 13],
      location: "TR-305",
      repeatType: 0,
      fromDate: "2020-12-27T16:00:41Z",
      toDate: "2020-12-28T04:00:41Z",
    },
  ]

  return (
    <>
      {/* <script src="https://apis.google.com/js/api.js" onLoad={handleClientLoad()} />
      <Button
        type="primary"
        onClick={() => {
          gapi.auth.authorize(authParams, myCallback)
        }}
      >
        login
      </Button>
      <Button
        type="primary"
        onClick={() => {
          execute()
        }}
      >
        newMeet
      </Button> */}
      <GoogleCalendar MeetingData={MeetingData} />
    </>
  )
}
