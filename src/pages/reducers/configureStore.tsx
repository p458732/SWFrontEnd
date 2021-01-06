import { createStore, combineReducers } from "redux"
import tokenReducer from "./token/token"
import roleReducer from "./role/role"
import emailReducer from "./email/email"

const rootReducer = combineReducers({
  tokenReducer,
  emailReducer,
  roleReducer,
})

const store = createStore(rootReducer)

export type storeTypes = ReturnType<typeof rootReducer>

export default store
