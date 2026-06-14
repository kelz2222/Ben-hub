import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const ADMIN_EMAIL = 'admin@benhub.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
  const logout = () => signOut(auth)
  const isAdmin = user?.email === ADMIN_EMAIL

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
