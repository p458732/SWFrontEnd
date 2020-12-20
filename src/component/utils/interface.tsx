export interface Department {
  name: string
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
  meetingID: number
  title: string
  description: string
  location: string
  attendees?: Array<User>
  departments: Array<string>
  creatorUid?: number
  repeatType: number
  updatedDate?: string
  createdDate?: string
  fromDate: string
  toDate: string
}
