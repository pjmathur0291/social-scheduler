'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, TrendingUp, Users, Heart, MessageCircle, Share, Eye, Calendar } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  // Mock analytics data
  const analyticsData = {
    totalPosts: 48,
    totalReach: 12500,
    totalEngagement: 2400,
    engagementRate: 19.2,
    topPerformingPost: {
      title: 'Product Launch Announcement',
      platform: 'Facebook',
      reach: 3200,
      engagement: 450,
      engagementRate: 14.1
    },
    platformStats: [
      { platform: 'Facebook', posts: 15, reach: 5200, engagement: 980, engagementRate: 18.8 },
      { platform: 'Instagram', posts: 12, reach: 3800, engagement: 720, engagementRate: 18.9 },
      { platform: 'Twitter', posts: 10, reach: 2100, engagement: 420, engagementRate: 20.0 },
      { platform: 'LinkedIn', posts: 8, reach: 1200, engagement: 240, engagementRate: 20.0 },
      { platform: 'YouTube', posts: 3, reach: 200, engagement: 40, engagementRate: 20.0 }
    ]
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Facebook': return 'text-blue-600'
      case 'Instagram': return 'text-pink-600'
      case 'Twitter': return 'text-sky-600'
      case 'LinkedIn': return 'text-blue-700'
      case 'YouTube': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <SessionGuard>
      <DashboardLayout title="Analytics" subtitle="Track your social media performance and engagement">
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Posts</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.totalPosts}</div>
                <p className="text-xs text-gray-500">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.totalReach.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Engagement</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.totalEngagement.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+15% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.engagementRate}%</div>
                <p className="text-xs text-gray-500">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Chart */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Engagement Over Time
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Track your engagement metrics across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement Chart</h3>
                    <p className="text-gray-600">Interactive chart will be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Platform Performance
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Compare performance across different platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.platformStats.map((platform, index) => (
                    <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${getPlatformColor(platform.platform)}`}>
                            {platform.platform}
                          </h4>
                          <p className="text-sm text-gray-600">{platform.posts} posts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {platform.engagementRate}% engagement
                        </p>
                        <p className="text-xs text-gray-500">
                          {platform.reach.toLocaleString()} reach
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Post */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Top Performing Post
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your best performing content this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {analyticsData.topPerformingPost.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className={`font-medium ${getPlatformColor(analyticsData.topPerformingPost.platform)}`}>
                        {analyticsData.topPerformingPost.platform}
                      </span>
                      <span>•</span>
                      <span>{analyticsData.topPerformingPost.reach.toLocaleString()} reach</span>
                      <span>•</span>
                      <span>{analyticsData.topPerformingPost.engagement} engagements</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-600">Likes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Comments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Share className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Shares</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.topPerformingPost.engagementRate}%
                    </div>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </SessionGuard>
  )
}

