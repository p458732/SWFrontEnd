/** @file token.tsx
  * @brief used to provide an interface of Rudux
   
  * @author Hong Eric
  * @date 2021-01-08
  * */
import { tokenActionTypes, SETTOKEN } from "../../action/token/token"

const reducer = (state = 0, action: tokenActionTypes): number => {
  switch (action.type) {
    case SETTOKEN:
      return action.payload.n
    default:
      return state
  }
}

export default reducer
