"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Mail, 
  Phone, 
  Building, 
  Globe,
  Calendar, 
  Target,
  Users,
  MessageSquare,
  Edit,
  Trash2,
  Download,
  User,
  Briefcase,
  DollarSign,
  Clock
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  website?: string
  businessType: string
  industry: string
  teamSize: string
  currentSocialMedia?: string
  platforms: string
  postFrequency: string
  budget: string
  goals: string
  challenges?: string
  timeline: string
  currentTools?: string
  expectations?: string
  additionalInfo?: string
  newsletter: boolean
  updates: boolean
  demo: boolean
  status: string
  source: string
  assignedTo?: string
  notes?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  utmId?: string
  referrer?: string
  landingPage?: string
  createdAt: string
  updatedAt: string
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchLead(params.id as string)
    }
  }, [params.id])

  const fetchLead = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`)
      if (response.ok) {
        const data = await response.json()
        setLead(data)
      } else {
        console.error("Lead not found")
        router.push("/admin/leads")
      }
    } catch (error) {
      console.error("Error fetching lead:", error)
      router.push("/admin/leads")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800"
      case "CONTACTED": return "bg-yellow-100 text-yellow-800"
      case "QUALIFIED": return "bg-green-100 text-green-800"
      case "PROPOSAL": return "bg-purple-100 text-purple-800"
      case "NEGOTIATION": return "bg-orange-100 text-orange-800"
      case "CLOSED_WON": return "bg-green-100 text-green-800"
      case "CLOSED_LOST": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const exportLead = () => {
    if (!lead) return

    const csvContent = [
      ["Field", "Value"],
      ["Name", `${lead.firstName} ${lead.lastName}`],
      ["Email", lead.email],
      ["Phone", lead.phone || ""],
      ["Company", lead.company || ""],
      ["Website", lead.website || ""],
      ["Business Type", lead.businessType],
      ["Industry", lead.industry],
      ["Team Size", lead.teamSize],
      ["Current Social Media", lead.currentSocialMedia || ""],
      ["Platforms", lead.platforms],
      ["Post Frequency", lead.postFrequency],
      ["Budget", lead.budget],
      ["Goals", lead.goals],
      ["Challenges", lead.challenges || ""],
      ["Timeline", lead.timeline],
      ["Current Tools", lead.currentTools || ""],
      ["Expectations", lead.expectations || ""],
      ["Additional Info", lead.additionalInfo || ""],
      ["Newsletter", lead.newsletter ? "Yes" : "No"],
      ["Updates", lead.updates ? "Yes" : "No"],
      ["Demo Call", lead.demo ? "Yes" : "No"],
      ["Status", lead.status],
      ["Source", lead.source],
      ["Created At", new Date(lead.createdAt).toLocaleDateString()]
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lead-${lead.firstName}-${lead.lastName}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="Lead Details"
        subtitle="Loading lead information..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lead details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!lead) {
    return (
      <DashboardLayout
        title="Lead Not Found"
        subtitle="The requested lead could not be found"
      >
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">The lead you're looking for doesn't exist or has been removed.</p>
            <Button
              onClick={() => router.push("/admin/leads")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={`${lead.firstName} ${lead.lastName}`}
      subtitle={`Lead captured on ${new Date(lead.createdAt).toLocaleDateString()}`}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/leads")}
          className="border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Lead
          </Button>
          <Button
            onClick={exportLead}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <Badge className={`${getStatusBadgeColor(lead.status)} text-sm px-3 py-1`}>
          {lead.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{lead.email}</p>
              </div>
            </div>
            {lead.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                </div>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Company</p>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
              </div>
            )}
            {lead.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {lead.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <Briefcase className="w-5 h-5 mr-2 text-green-600" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Business Type</p>
              <p className="text-sm text-gray-600">{lead.businessType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Industry</p>
              <p className="text-sm text-gray-600">{lead.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Team Size</p>
              <p className="text-sm text-gray-600">{lead.teamSize}</p>
            </div>
            {lead.currentSocialMedia && (
              <div>
                <p className="text-sm font-medium text-gray-900">Current Social Media</p>
                <p className="text-sm text-gray-600">{lead.currentSocialMedia}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requirements & Goals */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Requirements & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Platforms</p>
                <p className="text-sm text-gray-600">{lead.platforms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Post Frequency</p>
                <p className="text-sm text-gray-600">{lead.postFrequency}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Budget</p>
                <p className="text-sm text-gray-600">{lead.budget}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Timeline</p>
                <p className="text-sm text-gray-600">{lead.timeline}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Goals</p>
              <p className="text-sm text-gray-600">{lead.goals}</p>
            </div>
            {lead.challenges && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Challenges</p>
                <p className="text-sm text-gray-600">{lead.challenges}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        {(lead.currentTools || lead.expectations || lead.additionalInfo) && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.currentTools && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Current Tools</p>
                  <p className="text-sm text-gray-600">{lead.currentTools}</p>
                </div>
              )}
              {lead.expectations && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Expectations</p>
                  <p className="text-sm text-gray-600">{lead.expectations}</p>
                </div>
              )}
              {lead.additionalInfo && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Additional Information</p>
                  <p className="text-sm text-gray-600">{lead.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Marketing Preferences */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <Users className="w-5 h-5 mr-2 text-indigo-600" />
              Marketing Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Newsletter</span>
              <Badge className={lead.newsletter ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {lead.newsletter ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Product Updates</span>
              <Badge className={lead.updates ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {lead.updates ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Demo Call</span>
              <Badge className={lead.demo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {lead.demo ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* UTM Tracking */}
        {(lead.utmSource || lead.utmMedium || lead.utmCampaign || lead.referrer) && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                UTM Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.utmSource && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UTM Source</p>
                  <p className="text-sm text-gray-600">{lead.utmSource}</p>
                </div>
              )}
              {lead.utmMedium && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UTM Medium</p>
                  <p className="text-sm text-gray-600">{lead.utmMedium}</p>
                </div>
              )}
              {lead.utmCampaign && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UTM Campaign</p>
                  <p className="text-sm text-gray-600">{lead.utmCampaign}</p>
                </div>
              )}
              {lead.utmTerm && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UTM Term</p>
                  <p className="text-sm text-gray-600">{lead.utmTerm}</p>
                </div>
              )}
              {lead.utmContent && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UTM Content</p>
                  <p className="text-sm text-gray-600">{lead.utmContent}</p>
                </div>
              )}
              {lead.utmId && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UTM ID</p>
                  <p className="text-sm text-gray-600">{lead.utmId}</p>
                </div>
              )}
              {lead.referrer && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Referrer</p>
                  <a href={lead.referrer} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {lead.referrer}
                  </a>
                </div>
              )}
              {lead.landingPage && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Landing Page</p>
                  <a href={lead.landingPage} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {lead.landingPage}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lead Management */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Lead Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Status</p>
              <Badge className={`${getStatusBadgeColor(lead.status)} mt-1`}>
                {lead.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Source</p>
              <p className="text-sm text-gray-600">{lead.source}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Created</p>
              <p className="text-sm text-gray-600">{new Date(lead.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Last Updated</p>
              <p className="text-sm text-gray-600">{new Date(lead.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
