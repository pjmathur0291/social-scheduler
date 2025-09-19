'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface UserSession {
  user: User
  isAuthenticated: boolean
  loginTime: number
}

interface SessionContextType {
  session: UserSession | null
  isLoading: boolean
  signOut: () => void
  refreshSession: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function CustomSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkSession = () => {
    console.log('CustomSessionProvider: Checking session...')
    const storedSession = localStorage.getItem('userSession')
    console.log('CustomSessionProvider: Stored session:', storedSession)
    
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession)
        // Check if session is still valid (24 hours)
        const isExpired = Date.now() - parsedSession.loginTime > 24 * 60 * 60 * 1000
        if (!isExpired) {
          console.log('CustomSessionProvider: Valid session found:', parsedSession)
          setSession(parsedSession)
        } else {
          console.log('CustomSessionProvider: Session expired, removing')
          localStorage.removeItem('userSession')
          setSession(null)
        }
      } catch (error) {
        console.error('CustomSessionProvider: Error parsing session:', error)
        localStorage.removeItem('userSession')
        setSession(null)
      }
    } else {
      console.log('CustomSessionProvider: No session found')
      setSession(null)
    }
  }

  useEffect(() => {
    // Initial session check
    checkSession()
    setIsLoading(false)

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('CustomSessionProvider: Storage event received:', e.key)
      if (e.key === 'userSession') {
        console.log('CustomSessionProvider: userSession changed, rechecking...')
        checkSession()
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      console.log('CustomSessionProvider: sessionUpdated event received, rechecking...')
      checkSession()
    }

    // Also check for session changes periodically (fallback)
    const intervalId = setInterval(() => {
      const currentSession = localStorage.getItem('userSession')
      if (currentSession && !session) {
        console.log('CustomSessionProvider: Found session during periodic check')
        checkSession()
      }
    }, 500)

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('sessionUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sessionUpdated', handleCustomStorageChange)
      clearInterval(intervalId)
    }
  }, [session])

  const refreshSession = () => {
    checkSession()
  }

  const signOut = () => {
    localStorage.removeItem('userSession')
    setSession(null)
    window.location.href = '/auth/signin'
  }

  return (
    <SessionContext.Provider value={{ session, isLoading, signOut, refreshSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useCustomSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useCustomSession must be used within a CustomSessionProvider')
  }
  return context
}
