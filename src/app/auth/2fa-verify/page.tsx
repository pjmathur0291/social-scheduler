'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

function TwoFactorVerifyContent() {
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setDebugLogs(prev => [...prev, logMessage])
    console.log(logMessage)
  }

  useEffect(() => {
    addDebugLog('2FA Verify page loaded')
    
    // Get user email from URL params or session
    const email = searchParams.get('email')
    if (email) {
      setUserEmail(email)
      addDebugLog(`User email from URL: ${email}`)
    } else {
      addDebugLog('No email in URL, redirecting to signin')
      // Redirect to login if no email provided
      router.push('/auth/signin')
    }

    // Check for stored credentials
    const tempCredentials = sessionStorage.getItem('tempCredentials')
    if (tempCredentials) {
      addDebugLog('Found temp credentials in sessionStorage')
    } else {
      addDebugLog('No temp credentials found in sessionStorage')
    }

    // Cleanup function to clear stored credentials if component unmounts
    return () => {
      // Don't clear credentials in cleanup - let the verification process handle it
      addDebugLog('Component cleanup - not clearing temp credentials')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    addDebugLog(`Starting 2FA verification with token: ${token}`)
    
    if (!token || token.length !== 6) {
      setError('Please enter a valid 6-digit code')
      addDebugLog('Invalid token format')
      return
    }

    setIsLoading(true)
    setError('')
    setLastResult(null)

    try {
      // Get stored credentials
      const tempCredentials = sessionStorage.getItem('tempCredentials')
      if (!tempCredentials) {
        setError('Session expired. Please sign in again.')
        addDebugLog('No temp credentials found')
        router.push('/auth/signin')
        return
      }

      const { email, password } = JSON.parse(tempCredentials)
      addDebugLog(`Retrieved credentials for: ${email}`)

      // Don't clear temporary credentials yet - we need them for the API call
      addDebugLog('Keeping temp credentials for API call')
      
      // Verify the 2FA token with our custom endpoint first
      addDebugLog('Sending 2FA verification request...')
      
      const verifyResponse = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          twoFactorToken: token 
        }),
      })

      const verifyData = await verifyResponse.json()
      addDebugLog(`API Response Status: ${verifyResponse.status}`)
      addDebugLog(`API Response Data: ${JSON.stringify(verifyData, null, 2)}`)
      
      setLastResult({
        status: verifyResponse.status,
        data: verifyData,
        timestamp: new Date().toISOString()
      })

      if (verifyResponse.ok && verifyData.success) {
        // 2FA verification successful, create a custom session
        addDebugLog('2FA verification successful!')
        addDebugLog(`User data received: ${JSON.stringify(verifyData.user)}`)
        
        // Clear temporary credentials now that verification is successful
        sessionStorage.removeItem('tempCredentials')
        addDebugLog('Cleared temp credentials after successful verification')
        
        // Store user data in localStorage for session management
        const userSession = {
          user: verifyData.user,
          isAuthenticated: true,
          loginTime: Date.now()
        }
        
        const sessionString = JSON.stringify(userSession)
        localStorage.setItem('userSession', sessionString)
        addDebugLog(`Custom session created in localStorage: ${sessionString}`)
        
        // Verify the session was stored correctly
        const storedSession = localStorage.getItem('userSession')
        addDebugLog(`Verified stored session: ${storedSession}`)
        
        // Test if we can read it back immediately
        const testRead = localStorage.getItem('userSession')
        addDebugLog(`Immediate test read: ${testRead}`)
        
        // Dispatch custom event to notify session provider
        window.dispatchEvent(new CustomEvent('sessionUpdated'))
        addDebugLog('Dispatched sessionUpdated event')
        
        // Test if the event was dispatched
        addDebugLog('Testing event dispatch...')
        
        addDebugLog('✅ SUCCESS: 2FA verification complete!')
        setError('') // Clear any previous errors
        
        // Wait a moment for session to be set, then redirect
        setTimeout(() => {
          addDebugLog('Auto-redirecting to dashboard...')
          addDebugLog('Final localStorage check before redirect: ' + localStorage.getItem('userSession'))
          
          // Force a hard refresh to ensure session is detected
          addDebugLog('Using window.location.replace("/")')
          window.location.replace('/')
        }, 2000)
      } else {
        addDebugLog(`2FA verification failed: ${verifyData.message}`)
        setError(verifyData.message || 'Invalid verification code. Please try again.')
      }
    } catch (error) {
      addDebugLog(`Error during 2FA verification: ${error}`)
      setError('Failed to verify code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackupCode = async () => {
    // TODO: Implement backup code verification
    setError('Backup code verification not implemented yet')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-4">
          <div className="flex justify-between items-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <Button
              onClick={() => setShowDebug(!showDebug)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {showDebug ? 'Hide' : 'Show'} Debug
            </Button>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - 2FA Form */}
            <div className="space-y-6">
              {userEmail && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Verifying for: <span className="font-semibold text-gray-900">{userEmail}</span>
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="token" className="text-sm font-semibold text-gray-900">
                    Verification Code
                  </Label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="mt-1 text-center text-lg tracking-widest"
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Enter the 6-digit code from your Google Authenticator app
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                )}

                {lastResult && lastResult.status === 200 && lastResult.data.success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">2FA verification successful!</span>
                  </div>
                )}

                {lastResult && lastResult.status === 200 && lastResult.data.success ? (
                  <Button
                    onClick={async () => {
                      addDebugLog('Continue to Dashboard clicked')
                      
                      // Ensure session is set in localStorage
                      const userSession = {
                        user: lastResult.data.user,
                        isAuthenticated: true,
                        loginTime: Date.now()
                      }
                      localStorage.setItem('userSession', JSON.stringify(userSession))
                      addDebugLog('Session re-set in localStorage before navigation')
                      
                      // Dispatch event to update session provider
                      window.dispatchEvent(new CustomEvent('sessionUpdated'))
                      addDebugLog('Dispatched sessionUpdated event')
                      
                      // Wait a bit longer to ensure session provider updates
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      addDebugLog('Navigating to dashboard...')
                      
                      // Use window.location.replace for a hard redirect to ensure session is detected
                      window.location.replace('/')
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-lg"
                  >
                    Continue to Dashboard
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || token.length !== 6}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                )}
              </form>

              <div className="text-center">
                <button
                  onClick={handleBackupCode}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Use backup code instead
                </button>
              </div>

              <div className="text-center">
                <Link 
                  href="/auth/signin"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </div>

            {/* Right Column - Debug Console */}
            {showDebug && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Debug Console</h3>
                
                {/* Debug Logs */}
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-64 overflow-y-auto">
                  {debugLogs.length === 0 ? (
                    <div className="text-gray-500">No debug logs yet...</div>
                  ) : (
                    debugLogs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  )}
                </div>

                {/* Last API Result */}
                {lastResult && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Last API Response:</h4>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Status:</strong> {lastResult.status}
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Time:</strong> {new Date(lastResult.timestamp).toLocaleTimeString()}
                      </div>
                      <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(lastResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Storage Info */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Storage Status:</h4>
                  <div className="bg-gray-100 p-3 rounded-lg text-sm">
                    <div className="text-gray-700">
                      <strong>SessionStorage:</strong> {sessionStorage.getItem('tempCredentials') ? 'Has temp credentials' : 'Empty'}
                    </div>
                    <div className="text-gray-700">
                      <strong>LocalStorage:</strong> {localStorage.getItem('userSession') ? 'Has user session' : 'Empty'}
                    </div>
                  </div>
                </div>

                {/* Manual Actions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Manual Actions:</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        localStorage.setItem('userSession', JSON.stringify({
                          user: { id: 'test', email: 'test@test.com', name: 'Test User' },
                          isAuthenticated: true,
                          loginTime: Date.now()
                        }))
                        addDebugLog('Manually created test session')
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Create Test Session
                    </Button>
                    <Button
                      onClick={() => {
                        localStorage.removeItem('userSession')
                        addDebugLog('Cleared user session')
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Clear Session
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!token || token.length !== 6) {
                          addDebugLog('Please enter a 6-digit token first')
                          return
                        }
                        
                        addDebugLog(`Testing 2FA token: ${token}`)
                        
                        try {
                          const response = await fetch('/api/auth/2fa/test', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              email: userEmail || 'pranjal@mediagarh.com',
                              token: token 
                            })
                          })
                          
                          const data = await response.json()
                          addDebugLog(`Token test result: ${JSON.stringify(data)}`)
                          
                          if (data.success) {
                            addDebugLog('✅ Token is VALID!')
                          } else {
                            addDebugLog('❌ Token is INVALID!')
                          }
                        } catch (error) {
                          addDebugLog(`Token test error: ${error}`)
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Test 2FA Token
                    </Button>
                    <Button
                      onClick={async () => {
                        addDebugLog('Manual Go to Dashboard clicked')
                        
                        // Check if we have a session
                        const existingSession = localStorage.getItem('userSession')
                        if (!existingSession) {
                          addDebugLog('No session found, creating test session')
                          localStorage.setItem('userSession', JSON.stringify({
                            user: { id: 'test', email: 'test@test.com', name: 'Test User' },
                            isAuthenticated: true,
                            loginTime: Date.now()
                          }))
                        } else {
                          addDebugLog(`Found existing session: ${existingSession}`)
                        }
                        
                        // Dispatch event to update session provider
                        window.dispatchEvent(new CustomEvent('sessionUpdated'))
                        addDebugLog('Dispatched sessionUpdated event')
                        
                        // Wait to ensure session provider updates
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        addDebugLog('Navigating to dashboard...')
                        
                        // Use window.location.replace for a hard redirect
                        window.location.replace('/')
                      }}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        addDebugLog('Testing session detection...')
                        const session = localStorage.getItem('userSession')
                        addDebugLog(`Current session: ${session}`)
                        
                        if (session) {
                          try {
                            const parsed = JSON.parse(session)
                            addDebugLog(`Parsed session: ${JSON.stringify(parsed, null, 2)}`)
                            addDebugLog(`Is authenticated: ${parsed.isAuthenticated}`)
                            addDebugLog(`User: ${parsed.user?.email}`)
                          } catch (e) {
                            addDebugLog(`Error parsing session: ${e}`)
                          }
                        } else {
                          addDebugLog('No session found in localStorage')
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Test Session
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TwoFactorVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 2FA verification...</p>
        </div>
      </div>
    }>
      <TwoFactorVerifyContent />
    </Suspense>
  )
}
