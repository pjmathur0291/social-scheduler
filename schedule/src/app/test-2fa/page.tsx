'use client'

import { useState } from 'react'

export default function Test2FAPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const test2FAFlow = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Step 1: Test initial login
      console.log('Testing initial login...')
      const step1 = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'test@test.com', 
          password: 'password123' 
        })
      })
      
      const step1Data = await step1.json()
      console.log('Step 1 result:', step1Data)
      
      if (!step1Data.requires2FA) {
        setResult({ error: 'Should require 2FA but does not' })
        return
      }

      // Step 2: Test 2FA verification
      console.log('Testing 2FA verification...')
      const step2 = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'test@test.com', 
          password: 'password123',
          twoFactorToken: '777340' // Current token
        })
      })
      
      const step2Data = await step2.json()
      console.log('Step 2 result:', step2Data)
      
      if (step2Data.success) {
        // Create custom session
        const userSession = {
          user: step2Data.user,
          isAuthenticated: true,
          loginTime: Date.now()
        }
        
        localStorage.setItem('userSession', JSON.stringify(userSession))
        
        setResult({ 
          success: true, 
          message: '2FA verification successful! Session created.',
          user: step2Data.user,
          session: userSession
        })
      } else {
        setResult({ error: '2FA verification failed', details: step2Data })
      }
      
    } catch (error) {
      console.error('Test failed:', error)
      setResult({ error: 'Test failed', details: error })
    } finally {
      setIsLoading(false)
    }
  }

  const clearSession = () => {
    localStorage.removeItem('userSession')
    setResult(null)
  }

  const goToDashboard = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">2FA Flow Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={test2FAFlow}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test 2FA Flow'}
          </button>
          
          <button
            onClick={clearSession}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 ml-4"
          >
            Clear Session
          </button>
          
          <button
            onClick={goToDashboard}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 ml-4"
          >
            Go to Dashboard
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Result:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test 2FA Flow" to test the complete flow</li>
            <li>If successful, click "Go to Dashboard" to test the dashboard</li>
            <li>Use "Clear Session" to reset and test again</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
