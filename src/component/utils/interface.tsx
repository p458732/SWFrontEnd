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
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IkMyNjhEMUIwNkY2MkI0Qjc3MzY1QkY1RDkyNDgyNjYzIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MDg5MDIxMDgsImV4cCI6MTYwODkwNTcwOCwiaXNzIjoiaHR0cHM6Ly9zdy12aXJ0dWFsbWVldGluZ2Fzc2l0YW50LWF1dGguYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOiJodHRwczovL3N3LXZpcnR1YWxtZWV0aW5nYXNzaXRhbnQtYXV0aC5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJjbGllbnRfaWQiOiJmcm9udGVuZC5jbGllbnQiLCJzdWIiOiIyMSIsImF1dGhfdGltZSI6MTYwODkwMjEwOCwiaWRwIjoibG9jYWwiLCJqdGkiOiI4OUNDRDFBMUMxMTY5RkJFNjFCMkZGRThFODExNjA1RSIsImlhdCI6MTYwODkwMjEwOCwic2NvcGUiOlsibWVldGluZy1hcGlzIl0sImFtciI6WyJwd2QiXX0.SnQ1BHnfxIqkCP1saD5xhbv8USTjLbB_VF-vwpMFaQujfeoxrIIIlD8fOt-Dd7XW_qiWKwkn3Br2nvlvEI1cXjNEK0zmL6BhxW2DnU40hQ4Blwk5jpRMVpNTpCzBMh-mLIrC1UoIbG3Ch4bllxj1gM4VdtQ-8TVhUbZx0D5EjztLr1XTxYkJPN3yrT_lwEW2tIuo4JChSBU2VnfZLczfwdvfUb15mjsTOIZDKXY2_gX7aI1u49bYjFZYZRop4-OZ-ehE2CvfXdpu0pAToawcL6hLjLxifPDPdLHWdFGv1Feekkr1F9YfTaD---ltuu3WP2xjuTcJd4PbmbeK5ledbg",
})
