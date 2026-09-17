"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type DemoAuthValue = {
  isSignedIn: boolean
  isHydrated: boolean
  signIn: () => void
  signOut: () => void
}

const DemoAuthContext = createContext<DemoAuthValue | undefined>(undefined)
const storageKey = 'nexcart-demo-signed-in'

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsSignedIn(localStorage.getItem(storageKey) === 'true')
    setIsHydrated(true)
  }, [])

  function signIn() {
    localStorage.setItem(storageKey, 'true')
    setIsSignedIn(true)
  }

  function signOut() {
    localStorage.removeItem(storageKey)
    setIsSignedIn(false)
  }

  return <DemoAuthContext.Provider value={{ isSignedIn, isHydrated, signIn, signOut }}>{children}</DemoAuthContext.Provider>
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (!context) throw new Error('useDemoAuth must be used within DemoAuthProvider')
  return context
}
