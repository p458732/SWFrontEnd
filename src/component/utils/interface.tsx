export interface Department {
  name: string
}

export interface Room {
  name: string
  capacity: number
}

export interface UserGroup {
  name: string
}

export interface User {
  name: string
  password: string
  department: Department
  email: string
  group: UserGroup
}

export interface Meeting {
  title: string
  description: string
  roomName: string
  attendee: Array<User>
  departments: Array<string>
  creator?: string
  repeatType: boolean
  updatedDate?: string
  createdDate?: string
  fromDate: string
  toDate: string
}
