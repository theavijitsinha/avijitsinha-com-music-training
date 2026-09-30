import {
  createContext,
  useContext,
} from "react"

export const AccountContext = createContext(null)

export function useAccount() {
  const account = useContext(AccountContext)
  if (account === null) throw new Error("useAccount must be used within AccountProvider")
  return account
}
