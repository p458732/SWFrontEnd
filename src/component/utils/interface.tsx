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
  location: Room
  attendee: Array<User>
  departments: Array<Department>
  creator: User
  Repeat: string
  updatedDate: Date
  createdDate: Date
}
