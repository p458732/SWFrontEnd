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
