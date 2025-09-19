'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Image, Link, Hash, Clock, Send } from "lucide-react"

export default function CreatePostPage() {
  const [postData, setPostData] = useState({
    content: '',
    platform: '',
    scheduledDate: '',
    scheduledTime: '',
    hashtags: '',
    link: '',
    image: null as File | null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating post:', postData)
    // TODO: Implement post creation logic
  }

  return (
    <SessionGuard>
      <DashboardLayout title="Create Post" subtitle="Create and schedule your social media posts">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Create New Post
              </CardTitle>
              <CardDescription className="text-gray-600">
                Create engaging content for your social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-sm font-semibold text-gray-900">
                    Platform
                  </Label>
                  <Select value={postData.platform} onValueChange={(value: string) => setPostData({...postData, platform: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Post Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-semibold text-gray-900">
                    Post Content
                  </Label>
                  <Textarea
                    id="content"
                    value={postData.content}
                    onChange={(e) => setPostData({...postData, content: e.target.value})}
                    placeholder="What's on your mind?"
                    className="min-h-[120px] resize-none"
                    maxLength={280}
                  />
                  <div className="text-right text-sm text-gray-500">
                    {postData.content.length}/280 characters
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label htmlFor="hashtags" className="text-sm font-semibold text-gray-900 flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Hashtags
                  </Label>
                  <Input
                    id="hashtags"
                    value={postData.hashtags}
                    onChange={(e) => setPostData({...postData, hashtags: e.target.value})}
                    placeholder="#marketing #socialmedia #business"
                  />
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-semibold text-gray-900 flex items-center">
                    <Link className="w-4 h-4 mr-1" />
                    Link (Optional)
                  </Label>
                  <Input
                    id="link"
                    type="url"
                    value={postData.link}
                    onChange={(e) => setPostData({...postData, link: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-semibold text-gray-900 flex items-center">
                    <Image className="w-4 h-4 mr-1" />
                    Image (Optional)
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPostData({...postData, image: e.target.files?.[0] || null})}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate" className="text-sm font-semibold text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule Date
                    </Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={postData.scheduledDate}
                      onChange={(e) => setPostData({...postData, scheduledDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime" className="text-sm font-semibold text-gray-900 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Schedule Time
                    </Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={postData.scheduledTime}
                      onChange={(e) => setPostData({...postData, scheduledTime: e.target.value})}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {postData.scheduledDate ? 'Schedule Post' : 'Post Now'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-8"
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </SessionGuard>
  )
}

