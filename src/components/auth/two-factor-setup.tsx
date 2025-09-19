"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  Shield, 
  Check, 
  X, 
  Copy, 
  Download,
  AlertCircle,
  Key
} from "lucide-react"

interface TwoFactorSetupProps {
  onSetupComplete: () => void
  onCancel: () => void
}

interface TwoFactorConfig {
  secret: string
  qrCodeUrl: string
  qrCodeDataUrl: string
  backupCodes: string[]
}

export default function TwoFactorSetup({ onSetupComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup')
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig | null>(null)
  const [verificationToken, setVerificationToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedCodes, setCopiedCodes] = useState(false)

  const setupTwoFactor = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const config = await response.json()
        setTwoFactorConfig(config)
        setStep('verify')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to setup 2FA')
      }
    } catch (error) {
      setError('Failed to setup 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyToken = async () => {
    if (!verificationToken || !twoFactorConfig) return

    setIsLoading(true)
    setError('')

    try {
      // First, let's test the token generation
      const testResponse = await fetch('/api/auth/2fa/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: twoFactorConfig.secret,
          token: verificationToken
        }),
      })

      const testData = await testResponse.json()
      console.log('2FA Test Result:', testData)

      // Now try the actual verification
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: twoFactorConfig.secret,
          token: verificationToken,
          backupCodes: twoFactorConfig.backupCodes
        }),
      })

      if (response.ok) {
        setStep('backup')
      } else {
        const errorData = await response.json()
        setError(`${errorData.message || 'Invalid token'} 
        
Debug Info:
- Your code: ${testData.providedToken}
- Current code: ${testData.currentToken}
- Previous code: ${testData.previousToken}
- Next code: ${testData.nextToken}
- Time remaining: ${testData.timeRemaining}s`)
      }
    } catch (error) {
      setError('Failed to verify token')
    } finally {
      setIsLoading(false)
    }
  }

  const copyBackupCodes = () => {
    if (twoFactorConfig) {
      const codesText = twoFactorConfig.backupCodes.join('\n')
      navigator.clipboard.writeText(codesText)
      setCopiedCodes(true)
      setTimeout(() => setCopiedCodes(false), 2000)
    }
  }

  const downloadBackupCodes = () => {
    if (twoFactorConfig) {
      const codesText = twoFactorConfig.backupCodes.join('\n')
      const blob = new Blob([codesText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '2fa-backup-codes.txt'
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step 1: Setup */}
      {step === 'setup' && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>Setup Two-Factor Authentication</span>
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account with Google Authenticator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">What is Two-Factor Authentication?</h4>
              <p className="text-sm text-blue-800">
                Two-factor authentication (2FA) adds an extra layer of security by requiring a second form of verification 
                in addition to your password. You'll use the Google Authenticator app to generate time-based codes.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Before you begin:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Smartphone className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Install Google Authenticator on your mobile device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Make sure you have a secure backup method for your codes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Key className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Keep your backup codes in a safe place</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                onClick={setupTwoFactor}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                {isLoading ? 'Setting up...' : 'Start Setup'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Verify */}
      {step === 'verify' && twoFactorConfig && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <span>Scan QR Code</span>
            </CardTitle>
            <CardDescription>
              Scan the QR code with Google Authenticator to add your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={twoFactorConfig.qrCodeDataUrl} 
                  alt="QR Code for 2FA setup"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">Manual Entry (Alternative)</h4>
              <p className="text-sm text-yellow-800 mb-2">
                If you can't scan the QR code, you can manually enter this secret key:
              </p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-white border border-yellow-300 rounded text-sm font-mono">
                  {twoFactorConfig.secret}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(twoFactorConfig.secret)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="verification-token" className="text-sm font-semibold text-gray-900">
                Enter 6-digit code from Google Authenticator
              </Label>
              <Input
                id="verification-token"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="mt-1 text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-sm text-gray-600 mt-1">
                Make sure your device's time is synchronized. The code changes every 30 seconds.
                <br />
                <strong>Tip:</strong> Wait for a fresh code to appear in your authenticator app before entering it.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                onClick={verifyToken}
                disabled={isLoading || verificationToken.length !== 6}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Backup Codes */}
      {step === 'backup' && twoFactorConfig && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-6 h-6 text-green-600" />
              <span>Save Your Backup Codes</span>
            </CardTitle>
            <CardDescription>
              Store these backup codes in a safe place. You can use them to access your account if you lose your phone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ Two-Factor Authentication Enabled!</h4>
              <p className="text-sm text-green-800">
                Your account is now protected with 2FA. Make sure to save your backup codes.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Backup Codes</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyBackupCodes}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedCodes ? 'Copied!' : 'Copy'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadBackupCodes}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg border">
                {twoFactorConfig.backupCodes.map((code, index) => (
                  <div key={index} className="text-sm font-mono text-center p-2 bg-white rounded border">
                    {code}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                Each backup code can only be used once. Store them in a secure location.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={onSetupComplete}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
              >
                <Check className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
