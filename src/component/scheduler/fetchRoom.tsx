import GSTC from "gantt-schedule-timeline-calendar"
import { Room, header } from "../utils/interface"

const roomURL = "https://hw.seabao.ml/api/room"

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
  console.log(rows)
  return rows
}
function getRoom(state: any) {
  fetch(roomURL, {
    method: "GET",
    headers: header,
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
