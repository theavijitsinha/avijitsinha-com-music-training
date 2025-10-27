import {
  initializeApp,
} from "firebase/app";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA9l20I-iKlW42K1iC3T1UuYPoy9vZFS_4",
  authDomain: window.location.hostname,
  projectId: "avijitsinha-com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function signInWithGoogleRedirect() {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
}

export function handleGoogleLoginResult() {
  getRedirectResult(auth)
    .then((result) => {
      if (!result) return; // user may already be signed in or no redirect pending
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log("Signed in as:", user.displayName);
      console.log("ID Token:", credential?.idToken);
    })
    .catch((error) => {
      console.error("Redirect sign-in error:", error);
    });
}

export function signOutUser() {
  signOut(auth);
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { authUser, authLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

async function callApi(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const idToken = await user.getIdToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}