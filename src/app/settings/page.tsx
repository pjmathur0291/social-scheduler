"use client"

import { useState, useEffect } from "react"
import { useCustomSession } from "@/components/providers/custom-session-provider"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe, 
  Save,
  Check,
  AlertCircle,
  Key,
  Link,
  Download,
  Upload,
  Smartphone,
  LogOut
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import TwoFactorSetup from "@/components/auth/two-factor-setup"

interface UserSettings {
  name: string
  email: string
  company: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  formSubmissions: boolean
  weeklyReports: boolean
  systemUpdates: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
}

interface IntegrationSettings {
  googleSheetsEnabled: boolean
  emailMarketingEnabled: boolean
  webhookUrl: string
}

export default function SettingsPage() {
  const { signOut } = useCustomSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

  // User Profile Settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: '',
    email: '',
    company: '',
    timezone: 'UTC',
    language: 'en'
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    formSubmissions: true,
    weeklyReports: false,
    systemUpdates: true
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  })

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    googleSheetsEnabled: true,
    emailMarketingEnabled: false,
    webhookUrl: ''
  })

  useEffect(() => {
    // Load user settings from API or localStorage
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') return
      
      // In a real app, you'd fetch from API
      // For now, we'll use localStorage or defaults
      const savedUserSettings = localStorage.getItem('userSettings')
      if (savedUserSettings) {
        setUserSettings(JSON.parse(savedUserSettings))
      }

      const savedNotificationSettings = localStorage.getItem('notificationSettings')
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings))
      }

      const savedSecuritySettings = localStorage.getItem('securitySettings')
      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings))
      }

      const savedIntegrationSettings = localStorage.getItem('integrationSettings')
      if (savedIntegrationSettings) {
        setIntegrationSettings(JSON.parse(savedIntegrationSettings))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = async () => {
    setIsLoading(true)
    setSaveStatus('saving')

    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') return
      
      // Save to localStorage (in a real app, you'd save to API)
      localStorage.setItem('userSettings', JSON.stringify(userSettings))
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings))
      localStorage.setItem('integrationSettings', JSON.stringify(integrationSettings))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const exportSettings = () => {
    const allSettings = {
      user: userSettings,
      notifications: notificationSettings,
      security: securitySettings,
      integrations: integrationSettings
    }
    
    const dataStr = JSON.stringify(allSettings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'settings-backup.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ]

  return (
    <SessionGuard>
      <DashboardLayout title="Settings" subtitle="Manage your account settings and preferences">
      {/* 2FA Setup Modal */}
      {showTwoFactorSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TwoFactorSetup
              onSetupComplete={() => {
                setShowTwoFactorSetup(false)
                setSecuritySettings(prev => ({ ...prev, twoFactorAuth: true }))
              }}
              onCancel={() => setShowTwoFactorSetup(false)}
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={exportSettings}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Settings</span>
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-6 h-6 text-blue-600" />
                    <span>Profile Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-900">Full Name</Label>
                      <Input
                        id="name"
                        value={userSettings.name}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-900">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-sm font-semibold text-gray-900">Company</Label>
                      <Input
                        id="company"
                        value={userSettings.company}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, company: e.target.value }))}
                        className="mt-1"
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-sm font-semibold text-gray-900">Timezone</Label>
                      <select
                        id="timezone"
                        value={userSettings.timezone}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Shanghai">Shanghai</option>
                        <option value="Asia/Kolkata">India</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <span>Notification Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">Form Submissions</Label>
                        <p className="text-sm text-gray-600">Get notified when someone submits a form</p>
                      </div>
                      <Switch
                        checked={notificationSettings.formSubmissions}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, formSubmissions: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">Weekly Reports</Label>
                        <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">System Updates</Label>
                        <p className="text-sm text-gray-600">Get notified about system updates and maintenance</p>
                      </div>
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={securitySettings.twoFactorAuth ? "default" : "secondary"}>
                          {securitySettings.twoFactorAuth ? "Enabled" : "Disabled"}
                        </Badge>
                        {!securitySettings.twoFactorAuth ? (
                          <Button
                            size="sm"
                            onClick={() => setShowTwoFactorSetup(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                          >
                            <Smartphone className="w-4 h-4 mr-1" />
                            Setup
                          </Button>
                        ) : (
                          <Switch
                            checked={securitySettings.twoFactorAuth}
                            onCheckedChange={(checked) => 
                              setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout" className="text-sm font-semibold text-gray-900">
                        Session Timeout (minutes)
                      </Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                        className="mt-1"
                        min="5"
                        max="480"
                      />
                      <p className="text-sm text-gray-600 mt-1">Automatically log out after inactivity</p>
                    </div>
                    <div>
                      <Label htmlFor="passwordExpiry" className="text-sm font-semibold text-gray-900">
                        Password Expiry (days)
                      </Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                        className="mt-1"
                        min="30"
                        max="365"
                      />
                      <p className="text-sm text-gray-600 mt-1">Force password change after this many days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integration Settings */}
            {activeTab === 'integrations' && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link className="w-6 h-6 text-blue-600" />
                    <span>Integration Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure third-party integrations and webhooks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">Google Sheets Integration</Label>
                        <p className="text-sm text-gray-600">Automatically send form data to Google Sheets</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={integrationSettings.googleSheetsEnabled ? "default" : "secondary"}>
                          {integrationSettings.googleSheetsEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={integrationSettings.googleSheetsEnabled}
                          onCheckedChange={(checked) => 
                            setIntegrationSettings(prev => ({ ...prev, googleSheetsEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">Email Marketing Integration</Label>
                        <p className="text-sm text-gray-600">Connect with email marketing platforms</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={integrationSettings.emailMarketingEnabled ? "default" : "secondary"}>
                          {integrationSettings.emailMarketingEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={integrationSettings.emailMarketingEnabled}
                          onCheckedChange={(checked) => 
                            setIntegrationSettings(prev => ({ ...prev, emailMarketingEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="webhookUrl" className="text-sm font-semibold text-gray-900">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        value={integrationSettings.webhookUrl}
                        onChange={(e) => setIntegrationSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        className="mt-1"
                        placeholder="https://your-webhook-url.com/endpoint"
                      />
                      <p className="text-sm text-gray-600 mt-1">Receive real-time notifications when forms are submitted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data & Privacy Settings */}
            {activeTab === 'data' && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-6 h-6 text-blue-600" />
                    <span>Data & Privacy</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Data Export</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Download all your form data and settings in a portable format.
                      </p>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                      </Button>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">Sign Out</h4>
                      <p className="text-sm text-orange-800 mb-3">
                        Sign out of your account on this device. You'll need to sign in again to access your account.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        onClick={() => signOut()}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-800 mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
    </SessionGuard>
  )
}
