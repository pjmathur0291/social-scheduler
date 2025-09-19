'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, BarChart, Plus } from "lucide-react"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  // Mock scheduled posts data
  const scheduledPosts = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      platform: 'Facebook',
      scheduledAt: new Date('2024-01-15T10:00:00'),
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Weekly Newsletter',
      platform: 'LinkedIn',
      scheduledAt: new Date('2024-01-16T14:30:00'),
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      platform: 'Instagram',
      scheduledAt: new Date('2024-01-17T16:00:00'),
      status: 'scheduled'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Facebook': return 'bg-blue-500'
      case 'Twitter': return 'bg-sky-500'
      case 'Instagram': return 'bg-pink-500'
      case 'LinkedIn': return 'bg-blue-600'
      case 'YouTube': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <SessionGuard>
      <DashboardLayout title="Calendar" subtitle="View and manage your scheduled posts">
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <p className="text-xs text-gray-500">Posts this week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                <BarChart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">48</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2.4K</div>
                <p className="text-xs text-gray-500">Total interactions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">96%</div>
                <p className="text-xs text-gray-500">Posts delivered</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {view === 'month' ? 'Monthly View' : view === 'week' ? 'Weekly View' : 'Daily View'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric',
                  ...(view === 'week' && { day: 'numeric' })
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View</h3>
                  <p className="text-gray-600 mb-4">Interactive calendar will be implemented here</p>
                  <Button variant="outline" size="sm">
                    View Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Upcoming Posts
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your scheduled posts for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.title}</h4>
                        <p className="text-sm text-gray-600">{post.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {post.scheduledAt.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {post.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </SessionGuard>
  )
}

