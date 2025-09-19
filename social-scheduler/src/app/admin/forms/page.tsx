"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Code,
  BarChart,
  Calendar,
  Users,
  Settings
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FormConfig {
  id: string
  name: string
  description: string
  fields: any[]
  settings: any
  isActive: boolean
  createdAt: string
  updatedAt: string
  submissionCount?: number
}

export default function FormsManagementPage() {
  const [forms, setForms] = useState<FormConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/forms")
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      }
    } catch (error) {
      console.error("Error fetching forms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteForm = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setForms(forms.filter(form => form.id !== formId))
        alert('Form deleted successfully')
      } else {
        alert('Error deleting form')
      }
    } catch (error) {
      console.error("Error deleting form:", error)
      alert('Error deleting form')
    }
  }

  const duplicateForm = async (form: FormConfig) => {
    try {
      const duplicatedForm = {
        ...form,
        id: `form-${Date.now()}`,
        name: `${form.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedForm)
      })
      
      if (response.ok) {
        fetchForms() // Refresh the list
        alert('Form duplicated successfully')
      } else {
        alert('Error duplicating form')
      }
    } catch (error) {
      console.error("Error duplicating form:", error)
      alert('Error duplicating form')
    }
  }

  const getFormUrl = (formId: string) => {
    return `${window.location.origin}/forms/${formId}`
  }

  const copyFormUrl = (formId: string) => {
    const url = getFormUrl(formId)
    navigator.clipboard.writeText(url)
    alert('Form URL copied to clipboard!')
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="Forms Management"
        subtitle="Manage your custom forms"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forms...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <SessionGuard>
      <DashboardLayout
        title="Forms Management"
        subtitle="Create and manage your custom lead capture forms"
      >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Forms</h2>
          <p className="text-gray-700 font-medium">Create, edit, and manage custom forms</p>
        </div>
        <Button 
          onClick={() => window.location.href = '/admin/form-builder?id=new'}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms created yet</h3>
            <p className="text-gray-700 mb-6 font-medium">
              Create your first custom form to start capturing leads with your own design.
            </p>
            <Button 
              onClick={() => window.location.href = '/admin/form-builder'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">{form.name}</CardTitle>
                    <CardDescription className="text-gray-800 mt-1 font-semibold">
                      {form.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <Badge className={form.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Form Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{form.fields.length}</div>
                      <div className="text-xs text-blue-700 font-semibold">Fields</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {form.submissionCount || 0}
                      </div>
                      <div className="text-xs text-green-700 font-semibold">Submissions</div>
                    </div>
                  </div>

                  {/* Form URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Form URL</label>
                    <div className="flex space-x-2">
                      <Input
                        value={getFormUrl(form.id)}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyFormUrl(form.id)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(`/forms/${form.id}`, '_blank')}
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        console.log(`Navigating to edit form: ${form.id}`)
                        window.location.href = `/admin/form-builder?id=${form.id}`
                      }}
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = `/admin/forms/${form.id}/leads`}
                      className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      View Leads
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = `/admin/forms/${form.id}/embed`}
                      className="flex-1 border-green-200 hover:bg-green-50 text-green-600"
                    >
                      <Code className="w-3 h-3 mr-1" />
                      Embed
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateForm(form)}
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteForm(form.id)}
                      className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-gray-600 text-center font-medium">
                    Last updated: {new Date(form.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
    </SessionGuard>
  )
}
