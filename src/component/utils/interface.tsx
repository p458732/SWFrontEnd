export interface Department {
  name: string
  attendees: Array<any>
}

export interface Room {
  name: string
  capacity: number
  id: number
}

export interface UserGroup {
  name: string
}

export interface User {
  uid: number
  name: string
  department: Department
  email: string
  group: UserGroup
}

export interface Meeting {
  title: string
  description: string
  location: string
  repeatType: number
  toDate: string
  fromDate: string
  attendees: Array<any>
  departments: string[]
  meetingID?: number
  creatorUid?: number
}

export interface Member {
  name: string
  id: string
  email: string
  departmentName: string
}

export const header: Headers = new Headers({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization:
    "Bearer " +
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IkMyNjhEMUIwNkY2MkI0Qjc3MzY1QkY1RDkyNDgyNjYzIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MDg5MDcwMzIsImV4cCI6MTYwOTUxMTgzMiwiaXNzIjoiaHR0cHM6Ly9zdy12aXJ0dWFsbWVldGluZ2Fzc2l0YW50LWF1dGguYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOiJodHRwczovL3N3LXZpcnR1YWxtZWV0aW5nYXNzaXRhbnQtYXV0aC5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJjbGllbnRfaWQiOiJmcm9udGVuZC5jbGllbnQiLCJzdWIiOiIyMSIsImF1dGhfdGltZSI6MTYwODkwNzAzMiwiaWRwIjoibG9jYWwiLCJqdGkiOiI4NDcxNDg3NDEyQjlCQ0ZBMEYyRkNDQTg3QjcwMEI4QyIsImlhdCI6MTYwODkwNzAzMiwic2NvcGUiOlsibWVldGluZy1hcGlzIl0sImFtciI6WyJwd2QiXX0.YSdS6IIIiD6jcyhbx7WZOGu5iSNwesR66D3q9Vp4KqPXsOxA_j3ZEA-QRw99H9M2ZO702owZGPjZs2OWytA8himd-c2RXH5l7bSh6tbwQOqMMRrUhcX9u0Hjul_t_wOxjeXEghcK0KJUz3xy3VJgbAwCUiZOu75L6i4mFHQ_JmVbtgE-qy9MsWrMgesnV7irnPSWsp4R1TpYLHw7yU4t7jxcfAahmmJWFyWlBHiBqwBILK0bTJlRjSBHR1W5BKuodc0pV1cZORuBInSIl0pWbtsFBRwc68PCXh0FY_3lY3FH47EUKU34dreleP1waAAzK31KMc-M-oqndZKqS3iTRA",
})
