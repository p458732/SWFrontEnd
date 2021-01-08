/** @file email.tsx
  * @brief used to provide an interface of Rudux
   
  * @author Hong Eric
  * @date 2021-01-08
  * */
import { emailActionTypes, SETEMAIL } from "../../action/token/token"

const emailReducer = (state = 0, action: emailActionTypes): number => {
  switch (action.type) {
    case SETEMAIL:
      return action.payload.n
    default:
      return state
  }
}

export default emailReducer
