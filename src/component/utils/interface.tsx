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
