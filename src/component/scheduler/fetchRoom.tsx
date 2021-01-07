import GSTC from "gantt-schedule-timeline-calendar"
import { Room } from "../utils/interface"

const roomURL = "https://hw.seabao.ml/api/room"

/** @brief 
     set the gantt chart's row
  * @param param_in  User->  all of employees 
  * @return None */
function generateNewRows(room: Array<Room>) {
  const rows: any = {}
  for (let i = 0; i < room.length; i += 1) {
    const id = GSTC.api.GSTCID(room[i].name)
    rows[id] = {
      id,
      label: room[i].name,
      capacity: room[i].capacity,
      expanded: false,
    }
  }

  return rows
}

/** @brief 
      to fetch the Room data from database, and then change the gantt chart's row

  * @param param_in  None
  * @return None */
function getRoom(state: any, token: any) {
  fetch(roomURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      return response.json()
    })
    .then((roomData: Array<Room>) => {
      state.update("config.list.rows", () => {
        return generateNewRows(roomData)
      })
    })
}

export default getRoom
