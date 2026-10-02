import {
  initializeApp,
} from "firebase/app"
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth"
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

const firebaseConfig = {
  apiKey: "AIzaSyA9l20I-iKlW42K1iC3T1UuYPoy9vZFS_4",
  authDomain: window.location.hostname,
  projectId: "avijitsinha-com",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export function signInWithGoogleRedirect() {
  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider).catch(() => {
    console.error("Google sign-in could not be started.")
  })
}

export function handleGoogleLoginResult() {
  return getRedirectResult(auth).catch(() => {
    console.error("Google sign-in could not be completed.")
  })
}

export function signOutUser() {
  return signOut(auth).catch(() => {
    console.error("Google sign-out could not be completed.")
  })
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => onAuthStateChanged(auth, firebaseUser => {
    setAuthUser(firebaseUser)
    setAuthLoading(false)
  }), [])

  return <AuthContext.Provider value={{ authUser, authLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) throw new Error("useAuth must be used within AuthProvider")
  return context
}
