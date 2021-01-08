/** @file role.tsx
  * @brief used to provide an interface of Rudux
   
  * @author Hong Eric
  * @date 2021-01-08
  * */
import { roleActionTypes, SETROLE } from "../../action/role/role"

const reducer = (state = 0, action: roleActionTypes): number => {
  switch (action.type) {
    case SETROLE:
      return action.payload.n
    default:
      return state
  }
}

export default reducer
