'use client'

import { useState, useEffect } from 'react'

export default function Debug2FAPage() {
  const [sessionStorage, setSessionStorage] = useState<any>(null)
  const [localStorage, setLocalStorage] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    // Check sessionStorage
    const tempCredentials = window.sessionStorage.getItem('tempCredentials')
    setSessionStorage(tempCredentials ? JSON.parse(tempCredentials) : null)
    
    // Check localStorage
    const userSession = window.localStorage.getItem('userSession')
    setLocalStorage(userSession ? JSON.parse(userSession) : null)
  }, [])

  const testCompleteFlow = async () => {
    setTestResult('Testing...')
    
    try {
      // Step 1: Test initial login
      const step1 = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'test@test.com', 
          password: 'password123' 
        })
      })
      
      const step1Data = await step1.json()
      
      if (!step1Data.requires2FA) {
        setTestResult({ error: 'Should require 2FA but does not', step1: step1Data })
        return
      }

      // Step 2: Test 2FA verification
      const step2 = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'test@test.com', 
          password: 'password123',
          twoFactorToken: '551187'
        })
      })
      
      const step2Data = await step2.json()
      
      if (step2Data.success) {
        // Create session like the 2FA page does
        const userSession = {
          user: step2Data.user,
          isAuthenticated: true,
          loginTime: Date.now()
        }
        
        window.localStorage.setItem('userSession', JSON.stringify(userSession))
        
        setTestResult({ 
          success: true, 
          message: 'Complete flow successful!',
          step1: step1Data,
          step2: step2Data,
          session: userSession
        })
        
        // Update localStorage display
        setLocalStorage(userSession)
      } else {
        setTestResult({ error: '2FA verification failed', step1: step1Data, step2: step2Data })
      }
      
    } catch (error) {
      setTestResult({ error: 'Test failed', details: error })
    }
  }

  const clearAll = () => {
    window.sessionStorage.removeItem('tempCredentials')
    window.localStorage.removeItem('userSession')
    setSessionStorage(null)
    setLocalStorage(null)
    setTestResult(null)
  }

  const goToDashboard = () => {
    window.location.href = '/'
  }

  const goToSignIn = () => {
    window.location.href = '/auth/signin'
  }

  const goTo2FA = () => {
    window.location.href = '/auth/2fa-verify?email=test@test.com'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">2FA Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Session Storage</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-gray-900">
              {JSON.stringify(sessionStorage, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Local Storage</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-gray-900">
              {JSON.stringify(localStorage, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testCompleteFlow}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Complete Flow
            </button>
            <button
              onClick={clearAll}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear All Storage
            </button>
            <button
              onClick={goToSignIn}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Sign In
            </button>
            <button
              onClick={goTo2FA}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to 2FA Page
            </button>
            <button
              onClick={goToDashboard}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {testResult && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Test Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-gray-900">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-900">
            <li>Click "Test Complete Flow" to test the entire 2FA process</li>
            <li>Check the storage sections to see what's stored</li>
            <li>Use "Go to Sign In" to test the actual sign-in flow</li>
            <li>Use "Go to 2FA Page" to test the 2FA verification page directly</li>
            <li>Use "Go to Dashboard" to test if the session works</li>
            <li>Use "Clear All Storage" to reset everything</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
