import { createStore, combineReducers } from "redux"
import tokenReducer from "./token/token"

const rootReducer = combineReducers({
  tokenReducer,
})

const store = createStore(rootReducer)

export type storeTypes = ReturnType<typeof rootReducer>

export default store
