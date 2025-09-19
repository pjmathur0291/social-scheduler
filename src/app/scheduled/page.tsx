'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Calendar, Edit, Trash2, Play, Pause, Eye, BarChart } from "lucide-react"

export default function ScheduledPage() {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  // Mock scheduled posts data
  const scheduledPosts = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      content: 'Excited to announce our new product! 🚀 Check out the amazing features...',
      platform: 'Facebook',
      scheduledAt: new Date('2024-01-15T10:00:00'),
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      title: 'Weekly Newsletter',
      content: 'This week\'s highlights: New features, customer stories, and upcoming events...',
      platform: 'LinkedIn',
      scheduledAt: new Date('2024-01-16T14:30:00'),
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      content: 'Take a look behind the scenes of our development process! 📸',
      platform: 'Instagram',
      scheduledAt: new Date('2024-01-17T16:00:00'),
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 4,
      title: 'Industry News Update',
      content: 'Latest trends in social media marketing that you should know about...',
      platform: 'Twitter',
      scheduledAt: new Date('2024-01-18T09:00:00'),
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 5,
      title: 'Customer Success Story',
      content: 'How our customer increased their engagement by 300% using our platform...',
      platform: 'Facebook',
      scheduledAt: new Date('2024-01-19T11:30:00'),
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    }
  ]

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
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPosts = scheduledPosts.filter(post => {
    if (filter === 'all') return true
    if (filter === 'today') {
      const today = new Date()
      return post.scheduledAt.toDateString() === today.toDateString()
    }
    if (filter === 'this-week') {
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return post.scheduledAt >= today && post.scheduledAt <= weekFromNow
    }
    return post.platform.toLowerCase() === filter
  })

  return (
    <SessionGuard>
      <DashboardLayout title="Scheduled Posts" subtitle="Manage your scheduled social media content">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Scheduled Posts</h2>
              <p className="text-gray-700 font-medium">Manage and monitor your scheduled content</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                List View
              </Button>
              <Button
                variant={view === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('calendar')}
              >
                Calendar View
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter posts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{scheduledPosts.length}</div>
                <p className="text-xs text-gray-500">Posts in queue</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {scheduledPosts.filter(post => {
                    const today = new Date()
                    return post.scheduledAt.toDateString() === today.toDateString()
                  }).length}
                </div>
                <p className="text-xs text-gray-500">Posts scheduled</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
                <BarChart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {scheduledPosts.filter(post => {
                    const today = new Date()
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return post.scheduledAt >= today && post.scheduledAt <= weekFromNow
                  }).length}
                </div>
                <p className="text-xs text-gray-500">Posts this week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                <Eye className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <p className="text-xs text-gray-500">Posts delivered</p>
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-8 h-8 rounded-full ${getPlatformColor(post.platform)} flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">
                            {post.platform.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-600">{post.platform}</p>
                        </div>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.scheduledAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart className="w-4 h-4" />
                          <span>{post.engagement.likes + post.engagement.comments + post.engagement.shares} engagements</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" className="p-2" title="Preview">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2" title="Pause">
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Posts</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? "You don't have any scheduled posts yet. Create your first post to get started!"
                    : `No posts found for the selected filter. Try changing the filter to see more posts.`
                  }
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                  <Play className="w-4 h-4 mr-2" />
                  Create New Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </SessionGuard>
  )
}

