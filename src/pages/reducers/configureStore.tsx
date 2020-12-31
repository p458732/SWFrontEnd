import { createStore, combineReducers } from "redux"
import tokenReducer from "./token/token"
import emailReducer from "./email/email"
const rootReducer = combineReducers({
  tokenReducer,
  emailReducer,
})

const store = createStore(rootReducer)

export type storeTypes = ReturnType<typeof rootReducer>

export default store
