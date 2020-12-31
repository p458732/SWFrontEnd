export const SETTOKEN = "SETTOKEN"

interface SetTOKENI {
  type: typeof SETTOKEN
  payload: {
    n: string
  }
}

export const setToken = (n: string): SetTOKENI => ({
  type: SETTOKEN,
  payload: {
    n,
  },
})

export type tokenActionTypes = SetTOKENI
