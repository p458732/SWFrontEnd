/** @file role.tsx
  * @brief used to provide an interface of Rudux
   
  * @author Hong Eric
  * @date 2021-01-08
  * */

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

// eslint-disable-next-line @typescript-eslint/naming-convention
export type roleActionTypes = SetROLEI
