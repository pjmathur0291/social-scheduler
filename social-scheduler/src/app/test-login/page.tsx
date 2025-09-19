'use client'

import { useState } from 'react'

export default function TestLogin() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'pranjal@mediagarh.com', 
          password: 'Pranjal' 
        }),
      })

      const data = await response.json()
      console.log('Login response:', { status: response.status, data })

      setResult({
        status: response.status,
        data: data,
        requires2FA: data.requires2FA,
        shouldRedirect: data.requires2FA === true
      })

      if (data.requires2FA) {
        console.log('2FA required, would redirect to 2FA page')
        // Simulate the redirect logic
        const email = 'pranjal@mediagarh.com'
        const password = 'Pranjal'
        sessionStorage.setItem('tempCredentials', JSON.stringify({ email, password }))
        console.log('Stored temp credentials in sessionStorage')
        console.log('Would redirect to:', `/auth/2fa-verify?email=${encodeURIComponent(email)}`)
      }

    } catch (error) {
      console.error('Login error:', error)
      setResult({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Login Flow</h1>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login with pranjal@mediagarh.com'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <div className="text-sm space-y-1">
              <div><strong>Status:</strong> {result.status}</div>
              <div><strong>Requires 2FA:</strong> {result.requires2FA ? 'Yes' : 'No'}</div>
              <div><strong>Should Redirect:</strong> {result.shouldRedirect ? 'Yes' : 'No'}</div>
              {result.error && <div><strong>Error:</strong> {result.error}</div>}
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-blue-600">Full Response</summary>
              <pre className="text-xs mt-2 bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            Go to Sign In Page
          </a>
        </div>
      </div>
    </div>
  )
}
