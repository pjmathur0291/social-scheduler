'use client'

import { useCustomSession } from "@/components/providers/custom-session-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface SessionGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function SessionGuard({ children, fallback }: SessionGuardProps) {
  const { session, isLoading } = useCustomSession()
  const router = useRouter()

  useEffect(() => {
    console.log('SessionGuard - session check:', { session, isLoading })
    
    // Check if we're on the client side
    if (typeof window === 'undefined') return
    
    // Also check localStorage directly
    const localStorageSession = localStorage.getItem('userSession')
    console.log('SessionGuard - localStorage session:', localStorageSession)
    
    // Add a small delay to give the session provider time to detect the session
    const checkSession = () => {
      if (!isLoading && !session) {
        // Double-check localStorage directly before redirecting
        const directSession = localStorage.getItem('userSession')
        if (directSession) {
          console.log('SessionGuard - Found session in localStorage, waiting for provider to update...')
          // Wait a bit more for the provider to update
          setTimeout(() => {
            if (!session) {
              console.log('SessionGuard - Provider still not updated, forcing page reload to detect session')
              window.location.reload()
            }
          }, 2000)
        } else {
          console.log('SessionGuard - No session found, redirecting to signin')
          // Use window.location instead of router.push to avoid conflicts
          window.location.href = "/auth/signin"
        }
      } else if (session) {
        console.log('SessionGuard - Session found, allowing access:', session)
      }
    }
    
    // Add a small delay to allow session provider to initialize
    setTimeout(checkSession, 200)
  }, [session, isLoading])

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return <>{children}</>
}
