'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Settings, Trash2, ExternalLink, Users, BarChart, Calendar } from "lucide-react"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      platform: 'Facebook',
      username: '@mycompany',
      name: 'My Company Page',
      followers: 12500,
      isConnected: true,
      lastSync: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      platform: 'Instagram',
      username: '@mycompany',
      name: 'My Company',
      followers: 8900,
      isConnected: true,
      lastSync: '1 hour ago',
      status: 'active'
    },
    {
      id: 3,
      platform: 'Twitter',
      username: '@mycompany',
      name: 'My Company',
      followers: 3200,
      isConnected: true,
      lastSync: '30 minutes ago',
      status: 'active'
    },
    {
      id: 4,
      platform: 'LinkedIn',
      username: 'My Company',
      name: 'My Company Page',
      followers: 5600,
      isConnected: false,
      lastSync: 'Never',
      status: 'disconnected'
    },
    {
      id: 5,
      platform: 'YouTube',
      username: 'My Company Channel',
      name: 'My Company',
      followers: 1200,
      isConnected: false,
      lastSync: 'Never',
      status: 'disconnected'
    }
  ])

  const toggleAccount = (id: number) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { ...account, isConnected: !account.isConnected, status: !account.isConnected ? 'active' : 'disconnected' }
        : account
    ))
  }

  const deleteAccount = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id))
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Facebook': return 'bg-blue-500'
      case 'Instagram': return 'bg-pink-500'
      case 'Twitter': return 'bg-sky-500'
      case 'LinkedIn': return 'bg-blue-600'
      case 'YouTube': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <SessionGuard>
      <DashboardLayout title="Social Accounts" subtitle="Manage your connected social media accounts">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Connected Accounts</h2>
              <p className="text-gray-700 font-medium">Manage your social media accounts and permissions</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Accounts</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{accounts.length}</div>
                <p className="text-xs text-gray-500">Connected platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Accounts</CardTitle>
                <BarChart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {accounts.filter(acc => acc.isConnected).length}
                </div>
                <p className="text-xs text-gray-500">Currently connected</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Followers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {accounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Across all platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Last Sync</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2h</div>
                <p className="text-xs text-gray-500">Most recent update</p>
              </CardContent>
            </Card>
          </div>

          {/* Accounts List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${getPlatformColor(account.platform)} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {account.platform.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {account.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {account.platform} • {account.username}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Account Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {account.followers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {account.lastSync}
                        </div>
                        <div className="text-sm text-gray-600">Last Sync</div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={account.isConnected}
                          onCheckedChange={() => toggleAccount(account.id)}
                        />
                        <span className="text-sm text-gray-600">
                          {account.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Remove Account"
                          onClick={() => deleteAccount(account.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connect New Account */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Connect New Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Add more social media accounts to expand your reach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map((platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50"
                  >
                    <div className={`w-8 h-8 rounded-full ${getPlatformColor(platform)} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {platform.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{platform}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </SessionGuard>
  )
}

