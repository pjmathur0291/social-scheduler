"use client"

import { signIn, getSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Mail, Lock } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with:', { email, password: '***' })
    setIsLoading(true)

    try {
      // Check login with 2FA support
      const response = await fetch('/api/auth/login-with-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('Login response:', { status: response.status, data })

      if (response.ok) {
        if (data.requires2FA) {
          console.log('2FA required, redirecting to 2FA page')
          // 2FA is required, store credentials temporarily and redirect to 2FA verification
          sessionStorage.setItem('tempCredentials', JSON.stringify({ email, password }))
          
          console.log('Stored temp credentials, redirecting to:', `/auth/2fa-verify?email=${encodeURIComponent(email)}`)
          
          // Use window.location.href for immediate redirect
          window.location.href = `/auth/2fa-verify?email=${encodeURIComponent(email)}`
          
          // Fallback redirect after 1 second if the above doesn't work
          setTimeout(() => {
            console.log('Fallback redirect triggered')
            window.location.href = `/auth/2fa-verify?email=${encodeURIComponent(email)}`
          }, 1000)
          
          return
        } else {
          console.log('Login successful, creating NextAuth session')
          // Login successful, now sign in with NextAuth
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          if (result?.ok) {
            router.push("/")
          } else {
            alert("Login successful but session creation failed")
          }
        }
      } else {
        console.log('Login failed:', data.message)
        alert(data.message || "Invalid credentials")
      }
    } catch (error) {
      console.error('Login error:', error)
      alert("An error occurred: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sign In</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            
            {isLoading && (
              <div className="text-center text-sm text-gray-600 mt-2">
                Processing login request...
              </div>
            )}
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              onClick={handleGoogleSignIn}
            >
              Google
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <a href="/auth/signup" className="underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
