/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Button } from "antd"
import React, { useEffect, useState } from "react"
import { gapi } from "gapi-script"
import { DeliveredProcedureOutlined } from "@ant-design/icons"
import { Meeting } from "../utils/interface"

interface Event {
  summary: string
  location: string
  description: string
  start: {
    dateTime: string
  }
  end: {
    dateTime: string
  }
}

const CLIENT_ID = "1065980057742-m7ga9esujdi7bo6v9llc02p785kp4sca.apps.googleusercontent.com"
const API_KEY = "AIzaSyCfPa82e7-60AxvTPsX8wBclVmSTl_NIhs"

const authParams = {
  response_type: "token", // Retrieves an access token only
  client_id: CLIENT_ID, // Client ID from Cloud Console
  immediate: false, // For the demo, force the auth window every time
  scope: ["https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"], // Array of scopes
}

interface Init {
  MeetingData: Meeting[]
}

export default function GoogleCalendar(Props: Init) {
  const { MeetingData } = Props
  function handleClientLoad() {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ client_id: CLIENT_ID })
    })
  }

  function execute() {
    const events: Event[] = MeetingData.map(event => {
      return {
        summary: event.title,
        location: event.location,
        description: event.description,
        start: {
          dateTime: event.fromDate,
        },
        end: {
          dateTime: event.toDate,
        },
      }
    })
    console.log(events)
    // 多筆事件
    const batch = gapi.client.newBatch()
    events.forEach(event => {
      batch.add(
        gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        })
      )
    })

    batch.then(() => {
      console.log("all jobs now dynamically done!!!")
    })
  }

  function loadClient() {
    gapi.client.setApiKey(API_KEY)
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest").then(
      () => {
        console.log("GAPI client loaded for API")
        execute()
      },
      (err: any) => {
        console.error("Error loading GAPI client for API", err)
      }
    )
  }

  function myCallback(authResult: any) {
    if (authResult && authResult.access_token) {
      gapi.auth.setToken(authResult)
      console.log(authResult)

      loadClient()
    } else {
      // Authorization failed or user declined
    }
  }
  useEffect(() => {
    handleClientLoad()
  }, [])

  return (
    <>
      <script src="https://apis.google.com/js/api.js" />
      <Button
        onClick={() => {
          gapi.auth.authorize(authParams, myCallback)
        }}
        icon={<DeliveredProcedureOutlined style={{ fontSize: "48px" }} />}
        style={{ width: 60, height: 60 }}
      />
    </>
  )
}
