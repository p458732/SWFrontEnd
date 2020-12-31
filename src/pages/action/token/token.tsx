export const SETTOKEN = "SETTOKEN"
export const SETEMAIL = "SETEMAIL"
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

interface SetEMAILI {
  type: typeof SETEMAIL
  payload: {
    n: string
  }
}

export const setEmail = (n: string): SetEMAILI => ({
  type: SETEMAIL,
  payload: {
    n,
  },
})

export type emailActionTypes = SetEMAILI