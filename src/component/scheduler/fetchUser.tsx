import GSTC from "gantt-schedule-timeline-calendar"
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
function getUser(state: any, setuserList: any) {
  fetch(userURL, {
    method: "GET",
    headers: header,
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

export default getUser
