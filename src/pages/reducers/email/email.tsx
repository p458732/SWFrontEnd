import { emailActionTypes ,SETEMAIL} from "../../action/token/token"

const emailReducer = (state = 0, action: emailActionTypes): number => {
  switch (action.type) {
    case SETEMAIL:
      return action.payload.n
    default:
      return state
  }
}

export default emailReducer
