import GSTC from "gantt-schedule-timeline-calendar"
import { User } from "../utils/interface"

const userURL = "https://hw.seabao.ml/api/user"

//------------------------------------------------------------------------------------------------------------
/** @brief 
     set the gantt chart's row
  * @param param_in  User->  all of employees 
  * @return None */
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
//------------------------------------------------------------------------------------------------------------
/** @brief 
      to fetch the User data from database, and then change the gantt chart's row

  * @param param_in  None
  * @return None */
export function getUser(state: any, setuserList: any, token: any) {
  fetch(userURL, {
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
    .then((userData: Array<any>) => {
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
//------------------------------------------------------------------------------------------------------------
/** @brief 
      to get the user id, because we need to identify who is current user
      the way we get the id is compare to the email which used by user logged
  * @param param_in  email ->  to compare token->JWT token    setUserId->to render the gstc again
  * @return None */
export function getUserId(email: any, token: any, setUserId: any): number {
  fetch(userURL, {
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
    .then((userData: Array<any>) => {
      // find the match user emdil
      userData.forEach(element => {
        if (element.email === email) {
          setUserId(element.id)
        }
      })
    })
  return 456
}
