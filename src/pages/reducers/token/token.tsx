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
