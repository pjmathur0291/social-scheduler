'use client'

import SessionGuard from "@/components/auth/session-guard"
import Dashboard from "@/components/dashboard/dashboard"
import { useCustomSession } from "@/components/providers/custom-session-provider"

export default function Home() {
  const { session, isLoading } = useCustomSession()

  // Debug: Show session status
  console.log('Home page - Session status:', { session, isLoading })

  // If no session, redirect to signin immediately
  if (!isLoading && !session) {
    console.log('Home page - No session, redirecting to signin')
    window.location.href = '/auth/signin'
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <SessionGuard>
      <Dashboard />
    </SessionGuard>
  )
}