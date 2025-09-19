"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  Download,
  Search,
  Users,
  Target,
  Calendar,
  ExternalLink,
  Eye
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

interface FormConfig {
  id: string
  name: string
  description: string
  fields: FormField[]
  settings: any
}

interface FormLead {
  id: string
  formConfigId: string
  data: Record<string, any>
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  utmId?: string
  referrer?: string
  landingPage?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

interface FormLeadsResponse {
  formConfig: FormConfig
  leads: FormLead[]
  totalCount: number
}

export default function FormLeadsPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState<FormLeadsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLeads, setFilteredLeads] = useState<FormLead[]>([])

  useEffect(() => {
    if (params.id) {
      fetchFormLeads(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (formData?.leads) {
      const filtered = formData.leads.filter(lead => {
        const searchLower = searchTerm.toLowerCase()
        return Object.values(lead.data).some(value => 
          String(value).toLowerCase().includes(searchLower)
        )
      })
      setFilteredLeads(filtered)
    }
  }, [formData, searchTerm])

  const fetchFormLeads = async (formId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/forms/${formId}/leads`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      } else {
        console.error("Failed to fetch form leads")
      }
    } catch (error) {
      console.error("Error fetching form leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!formData?.leads) return

    const headers = [
      'Submission ID',
      'Created At',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Referrer',
      'Landing Page',
      ...formData.formConfig.fields.map(field => field.label)
    ]

    const csvData = formData.leads.map(lead => [
      lead.id,
      new Date(lead.createdAt).toLocaleDateString(),
      lead.utmSource || '',
      lead.utmMedium || '',
      lead.utmCampaign || '',
      lead.referrer || '',
      lead.landingPage || '',
      ...formData.formConfig.fields.map(field => lead.data[field.id] || '')
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.formConfig.name}-leads.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getFieldValue = (lead: FormLead, fieldId: string) => {
    return lead.data[fieldId] || ''
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Form Leads"
        subtitle="Loading form leads..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form leads...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!formData) {
    return (
      <DashboardLayout
        title="Form Leads"
        subtitle="Form not found"
      >
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h2>
          <p className="text-gray-700 mb-6">The requested form could not be found.</p>
          <Button onClick={() => router.push('/admin/forms')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={`${formData.formConfig.name} - Leads`}
      subtitle={`Viewing leads for: ${formData.formConfig.description}`}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/forms')}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {formData.leads.length} submissions available
            </div>
            <Button 
              onClick={exportToCSV} 
              disabled={formData.leads.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-800">Total Submissions</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{formData.totalCount}</div>
              <p className="text-xs text-blue-600 mt-1">All time submissions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-800">Form Fields</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{formData.formConfig.fields.length}</div>
              <p className="text-xs text-green-600 mt-1">Custom fields</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-800">UTM Tracked</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {formData.leads.filter(lead => lead.utmSource).length}
              </div>
              <p className="text-xs text-purple-600 mt-1">With UTM data</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-800">Latest Submission</CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-orange-900">
                {formData.leads.length > 0 
                  ? new Date(formData.leads[0].createdAt).toLocaleDateString()
                  : 'No submissions'
                }
              </div>
              <p className="text-xs text-orange-600 mt-1">Most recent</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Search & Filter
            </CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Find specific submissions quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by name, email, phone, or any field value..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="h-12 px-4 border-gray-300 hover:bg-gray-50"
                >
                  Clear
                </Button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600">
                Showing {filteredLeads.length} of {formData.leads.length} submissions
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Form Submissions ({filteredLeads.length})
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium mt-1">
                  All submissions for this form
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
                {formData.totalCount} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No submissions found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm ? 'No submissions match your search criteria. Try adjusting your search terms.' : 'This form has no submissions yet. Share the form URL to start collecting leads!'}
                </p>
                {!searchTerm && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      const formUrl = `${window.location.origin}/forms/${formData.formConfig.id}`
                      navigator.clipboard.writeText(formUrl)
                      alert('Form URL copied to clipboard!')
                    }}
                  >
                    Copy Form URL
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Submission ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Created</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">UTM Source</th>
                      {formData.formConfig.fields.slice(0, 3).map(field => (
                        <th key={field.id} className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                          {field.label}
                        </th>
                      ))}
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead, index) => (
                      <tr key={lead.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-6">
                          <code className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-mono">
                            {lead.id.slice(0, 8)}...
                          </code>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(lead.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {lead.utmSource ? (
                            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
                              {lead.utmSource}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 text-xs">
                              Direct
                            </Badge>
                          )}
                        </td>
                        {formData.formConfig.fields.slice(0, 3).map(field => (
                          <td key={field.id} className="py-4 px-6">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {getFieldValue(lead, field.id) || (
                                <span className="text-gray-400 italic">-</span>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => {
                                // Open lead details in new tab
                                const leadDetails = {
                                  ...lead,
                                  formConfig: formData.formConfig
                                }
                                const blob = new Blob([JSON.stringify(leadDetails, null, 2)], { type: 'application/json' })
                                const url = URL.createObjectURL(blob)
                                window.open(url, '_blank')
                              }}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-green-50 hover:border-green-300"
                              onClick={() => {
                                if (lead.landingPage) {
                                  window.open(lead.landingPage, '_blank')
                                }
                              }}
                              title="View Landing Page"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
