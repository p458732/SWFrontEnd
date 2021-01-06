export const SETROLE = "SETROLE"
interface SetROLEI {
  type: typeof SETROLE
  payload: {
    n: string
  }
}

export const setRole = (n: string): SetROLEI => ({
  type: SETROLE,
  payload: {
    n,
  },
})

export type roleActionTypes = SetROLEI
