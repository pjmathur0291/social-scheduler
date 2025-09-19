'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Copy, Edit, Trash2, Eye, Calendar, Users } from "lucide-react"

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock templates data
  const templates = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      description: 'Perfect for announcing new products or features',
      category: 'Marketing',
      platform: 'Facebook',
      content: '🚀 Exciting news! We\'re thrilled to announce our latest [PRODUCT_NAME]! \n\n✨ Key features:\n• [FEATURE_1]\n• [FEATURE_2]\n• [FEATURE_3]\n\n🎯 [CALL_TO_ACTION]\n\n#ProductLaunch #Innovation #NewProduct',
      tags: ['product', 'launch', 'announcement'],
      usageCount: 15,
      createdAt: '2024-01-10',
      isPublic: true
    },
    {
      id: 2,
      title: 'Behind the Scenes',
      description: 'Show your team and process to build connection',
      category: 'Engagement',
      platform: 'Instagram',
      content: '📸 Behind the scenes at [COMPANY_NAME]! \n\nToday we\'re working on [PROJECT_DESCRIPTION]. Here\'s what our team is up to:\n\n👥 Meet [TEAM_MEMBER] - [ROLE]\n💡 [INSIGHT_OR_TIP]\n\nWhat would you like to see more of? Let us know in the comments! 👇\n\n#BehindTheScenes #TeamWork #CompanyCulture',
      tags: ['behind-the-scenes', 'team', 'culture'],
      usageCount: 8,
      createdAt: '2024-01-08',
      isPublic: true
    },
    {
      id: 3,
      title: 'Customer Success Story',
      description: 'Share how your product helped a customer',
      category: 'Testimonial',
      platform: 'LinkedIn',
      content: '🎉 Success Story: How [CUSTOMER_NAME] achieved [RESULT] with [PRODUCT/SERVICE]\n\n📊 The Challenge:\n[CUSTOMER_CHALLENGE]\n\n💡 Our Solution:\n[SOLUTION_DESCRIPTION]\n\n📈 The Results:\n• [RESULT_1]\n• [RESULT_2]\n• [RESULT_3]\n\nReady to achieve similar results? [CALL_TO_ACTION]\n\n#CustomerSuccess #CaseStudy #Results',
      tags: ['customer', 'success', 'testimonial'],
      usageCount: 12,
      createdAt: '2024-01-05',
      isPublic: true
    },
    {
      id: 4,
      title: 'Weekly Newsletter',
      description: 'Regular updates and company news',
      category: 'Newsletter',
      platform: 'Twitter',
      content: '📰 Weekly Update from [COMPANY_NAME]\n\nThis week\'s highlights:\n\n🔥 [HIGHLIGHT_1]\n📈 [HIGHLIGHT_2]\n🎯 [HIGHLIGHT_3]\n\nStay tuned for more updates! [LINK_TO_FULL_NEWSLETTER]\n\n#WeeklyUpdate #News #CompanyUpdate',
      tags: ['newsletter', 'update', 'weekly'],
      usageCount: 6,
      createdAt: '2024-01-03',
      isPublic: true
    },
    {
      id: 5,
      title: 'Holiday Greeting',
      description: 'Seasonal greetings and celebrations',
      category: 'Holiday',
      platform: 'Facebook',
      content: '🎉 [HOLIDAY_NAME] Greetings from [COMPANY_NAME]!\n\nWe hope this [HOLIDAY_NAME] brings you joy, happiness, and wonderful moments with your loved ones. \n\nThank you for being part of our community. We\'re grateful for your support! 🙏\n\nWishing you a [HOLIDAY_NAME] filled with [POSITIVE_WISHES]!\n\n#HolidayGreetings #ThankYou #Community',
      tags: ['holiday', 'greeting', 'celebration'],
      usageCount: 4,
      createdAt: '2024-01-01',
      isPublic: true
    }
  ]

  const categories = ['all', 'Marketing', 'Engagement', 'Testimonial', 'Newsletter', 'Holiday']

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Marketing': return 'bg-purple-100 text-purple-800'
      case 'Engagement': return 'bg-green-100 text-green-800'
      case 'Testimonial': return 'bg-blue-100 text-blue-800'
      case 'Newsletter': return 'bg-orange-100 text-orange-800'
      case 'Holiday': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <SessionGuard>
      <DashboardLayout title="Content Templates" subtitle="Create and manage your social media content templates">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Content Templates</h2>
              <p className="text-gray-700 font-medium">Save time with pre-built content templates</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Templates</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
                <p className="text-xs text-gray-500">Available templates</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Most Used</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.max(...templates.map(t => t.usageCount))}
                </div>
                <p className="text-xs text-gray-500">Times used</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{categories.length - 1}</div>
                <p className="text-xs text-gray-500">Template categories</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Time Saved</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-md hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${getPlatformColor(template.platform)} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {template.platform.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {template.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {template.platform}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-2">{template.description}</p>
                  
                  {/* Template Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
                      {template.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Used {template.usageCount} times
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm" className="p-2" title="Preview">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2" title="Use Template">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2" title="Edit">
                        <Edit className="w-4 h-4" />
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
          {filteredTemplates.length === 0 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all'
                    ? "No templates match your search criteria. Try adjusting your filters."
                    : "You don't have any templates yet. Create your first template to get started!"
                  }
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </SessionGuard>
  )
}
