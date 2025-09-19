import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export interface TwoFactorAuthConfig {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface TwoFactorAuthService {
  generateSecret(userEmail: string): TwoFactorAuthConfig
  verifyToken(secret: string, token: string): boolean
  generateBackupCodes(): string[]
}

class TwoFactorAuthServiceImpl implements TwoFactorAuthService {
  generateSecret(userEmail: string): TwoFactorAuthConfig {
    // Generate a secret key
    const secret = speakeasy.generateSecret({
      name: `Social Scheduler (${userEmail})`,
      issuer: 'Social Scheduler',
      length: 32,
      symbols: false // Use only alphanumeric characters
    })

    // Generate QR code URL with explicit parameters
    const qrCodeUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: userEmail,
      issuer: 'Social Scheduler',
      algorithm: 'sha1',
      digits: 6,
      period: 30,
      encoding: 'base32'
    })

    // Generate backup codes
    const backupCodes = this.generateBackupCodes()

    console.log('Generated 2FA Secret:', {
      secret: secret.base32,
      qrCodeUrl,
      userEmail
    })

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    }
  }

  verifyToken(secret: string, token: string): boolean {
    try {
      // Clean the token (remove any non-numeric characters)
      const cleanToken = token.replace(/\D/g, '')
      
      if (cleanToken.length !== 6) {
        console.log('Token length invalid:', cleanToken.length)
        return false
      }

      // Get current time in seconds
      const currentTime = Math.floor(Date.now() / 1000)
      
      // Try verification with different time windows
      const result = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: cleanToken,
        window: 2, // Allow 2 time steps (60 seconds) of tolerance
        time: currentTime,
        step: 30 // 30 second time step
      })

      // If verification fails, try generating a token to compare
      if (!result) {
        const generatedToken = speakeasy.totp({
          secret,
          encoding: 'base32',
          time: currentTime,
          step: 30
        })

        console.log('2FA Verification Failed:', {
          secret: secret.substring(0, 10) + '...',
          providedToken: cleanToken,
          generatedToken,
          currentTime,
          timeStep: Math.floor(currentTime / 30)
        })
      } else {
        console.log('2FA Verification Success:', {
          secret: secret.substring(0, 10) + '...',
          token: cleanToken,
          currentTime
        })
      }

      return result
    } catch (error) {
      console.error('Error verifying 2FA token:', error)
      return false
    }
  }

  generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      // Generate 8-character alphanumeric codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
  }

  async generateQRCode(qrCodeUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(qrCodeUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }
}

export const twoFactorAuthService = new TwoFactorAuthServiceImpl()
