import GSTC from "gantt-schedule-timeline-calendar"
import { Room } from "../utils/interface"

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
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer " +
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IkMyNjhEMUIwNkY2MkI0Qjc3MzY1QkY1RDkyNDgyNjYzIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MDg4OTc1MTcsImV4cCI6MTYwODkwMTExNywiaXNzIjoiaHR0cHM6Ly9zdy12aXJ0dWFsbWVldGluZ2Fzc2l0YW50LWF1dGguYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOiJodHRwczovL3N3LXZpcnR1YWxtZWV0aW5nYXNzaXRhbnQtYXV0aC5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJjbGllbnRfaWQiOiJmcm9udGVuZC5jbGllbnQiLCJzdWIiOiIyMSIsImF1dGhfdGltZSI6MTYwODg5NzUxNywiaWRwIjoibG9jYWwiLCJqdGkiOiJEMEY1N0VCQzIxMUE0NjYyRTlCQkE3OTYyRjNERkRBRSIsImlhdCI6MTYwODg5NzUxNywic2NvcGUiOlsibWVldGluZy1hcGlzIl0sImFtciI6WyJwd2QiXX0.oNiitreJOMTd-EtTxcjNkDCEdfEV-XRMsnCUtTRmHAR72S6ZwHwaMqR7_RaDEsh3AuxsbG-IB4F1M9qg5nZfW0OdiLmlHNkGt8D9FB-oMTAdtSJuANeIhBPKlrMA4JMArlVeYlaeQT3Dr0bfbhkuE0V6K9RAOPcMDTkLu2j7QWiXUKnEYKQ3vj3AfHZiRLaHCv4hMi4RXXl9B0mvwr_5go9HXHzr3ZPhSg1OTKGyxLhx4eOD0glyoqjJMc58-6B-qVF3TKboN0aDUTsXE_w5I0UPjc66z8CfnSvNNnwGy9QfJfp98-2LPzm3uuWhvj5eGlNsIQl8IK7ou7T14yTMig",
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
