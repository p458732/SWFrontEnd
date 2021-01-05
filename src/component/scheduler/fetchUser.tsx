import GSTC from "gantt-schedule-timeline-calendar"
import { useSelector, useDispatch } from "react-redux"
import { User, header } from "../utils/interface"

const userURL = "https://hw.seabao.ml/api/user"

function generateNewRows(user: Array<User>) {
  const rows: any = {}
  for (let i = 0; i < user.length; i += 1) {
    const id = GSTC.api.GSTCID(user[i].name)
    rows[id] = {
      id,
      label: user[i].name,
      expanded: false,
    }
  }

  return rows
}
function getUser(state: any, setuserList: any, token: any) {
  fetch(userURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(response => {
      return response.json()
    })
    .then((userData: Array<User>) => {
      state.update("config.list.rows", () => {
        return generateNewRows(userData)
      })
      const map = new Map()
      userData.forEach(element => {
        map.set(element.id, element.name)
      })

      setuserList(map)
    })
}
export function getUserId(email: any, token: any) {
  fetch(userURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(response => {
      return response.json()
    })
    .then((userData: Array<User>) => {
      let id = 0
      userData.forEach(element => {
        if (element.email === email) {
          id = element.uid
        }
      })
      return 45
    })
}
export default getUser
