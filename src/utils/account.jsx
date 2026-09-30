import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { AccountContext } from "./account-context"
import {
  accountSignInUrl,
  csrfFromCookie,
  fetchCurrentAccount,
  logoutCurrentAccount,
} from "./account-api"

export function AccountProvider({ children }) {
  const [accountUser, setAccountUser] = useState(null)
  const [accountLoading, setAccountLoading] = useState(true)
  const [accountBusy, setAccountBusy] = useState(false)
  const [accountError, setAccountError] = useState("")

  const refreshAccount = useCallback(async (signal) => {
    setAccountLoading(true)
    setAccountError("")
    try {
      const account = await fetchCurrentAccount(fetch, signal)
      setAccountUser(account)
    } catch (error) {
      if (error?.name !== "AbortError") {
        setAccountUser(null)
        setAccountError("Account status is temporarily unavailable.")
      }
    } finally {
      if (!signal?.aborted) setAccountLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void refreshAccount(controller.signal)
    return () => controller.abort()
  }, [refreshAccount])

  const signIn = useCallback(() => {
    window.location.assign(accountSignInUrl())
  }, [])

  const signOut = useCallback(async () => {
    const csrfToken = csrfFromCookie(document.cookie)
    if (csrfToken === null) {
      setAccountError("Your session could not be verified. Reload and try again.")
      return
    }
    setAccountBusy(true)
    setAccountError("")
    try {
      await logoutCurrentAccount(csrfToken)
      setAccountUser(null)
    } catch {
      setAccountError("Sign-out could not be completed. Please try again.")
    } finally {
      setAccountBusy(false)
    }
  }, [])

  const value = useMemo(() => ({
    accountUser,
    accountLoading,
    accountBusy,
    accountError,
    refreshAccount,
    signIn,
    signOut,
  }), [accountUser, accountLoading, accountBusy, accountError, refreshAccount, signIn, signOut])

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}
