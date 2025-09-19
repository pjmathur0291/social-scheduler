"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Target,
  Eye,
  Edit,
  Trash2,
  Download
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"

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

export default function LeadsManagementPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [utmSourceFilter, setUtmSourceFilter] = useState("all")
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchTerm, statusFilter, utmSourceFilter])

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = leads

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // UTM Source filter
    if (utmSourceFilter !== "all") {
      if (utmSourceFilter === "direct") {
        filtered = filtered.filter(lead => !lead.utmSource)
      } else {
        filtered = filtered.filter(lead => lead.utmSource === utmSourceFilter)
      }
    }

    setFilteredLeads(filtered)
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

  const exportLeads = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Business Type", "Industry", "Team Size", "Platforms", "Budget", "Timeline", "UTM Source", "UTM Campaign", "UTM Medium", "Referrer", "Status", "Created At"],
      ...filteredLeads.map(lead => [
        `${lead.firstName} ${lead.lastName}`,
        lead.email,
        lead.phone || "",
        lead.company || "",
        lead.businessType,
        lead.industry,
        lead.teamSize,
        lead.platforms,
        lead.budget,
        lead.timeline,
        lead.utmSource || "Direct",
        lead.utmCampaign || "",
        lead.utmMedium || "",
        lead.referrer || "",
        lead.status,
        new Date(lead.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="Leads Management"
        subtitle="View and manage all captured leads"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leads...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <SessionGuard>
      <DashboardLayout
        title="Leads Management"
        subtitle="View and manage all captured leads"
      >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Leads</CardTitle>
            <Target className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {leads.filter(lead => lead.status === "NEW").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Qualified</CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {leads.filter(lead => lead.status === "QUALIFIED").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Closed Won</CardTitle>
            <Target className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {leads.filter(lead => lead.status === "CLOSED_WON").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Filters & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={utmSourceFilter} onValueChange={setUtmSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by UTM source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="direct">Direct Traffic</SelectItem>
                  {Array.from(new Set(leads.map(lead => lead.utmSource).filter(Boolean))).map(source => (
                    <SelectItem key={source} value={source as string}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={exportLeads}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Leads ({filteredLeads.length})
          </CardTitle>
          <CardDescription>
            Manage and track your lead pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No leads have been captured yet. Share your lead form to start collecting leads."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Business Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Budget</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">UTM Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{lead.industry}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {lead.company && (
                            <div className="flex items-center text-sm text-gray-900">
                              <Building className="h-3 w-3 mr-1" />
                              {lead.company}
                            </div>
                          )}
                          {lead.website && (
                            <div className="text-sm text-blue-600">{lead.website}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{lead.businessType}</div>
                        <div className="text-sm text-gray-500">{lead.teamSize}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{lead.budget}</div>
                        <div className="text-sm text-gray-500">{lead.timeline}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {lead.utmSource ? (
                            <div>
                              <div className="font-medium">{lead.utmSource}</div>
                              {lead.utmCampaign && <div className="text-xs text-gray-500">{lead.utmCampaign}</div>}
                            </div>
                          ) : (
                            <span className="text-gray-400">Direct</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadgeColor(lead.status)}>
                          {lead.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/admin/leads/${lead.id}`, '_blank')}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <Edit className="h-3 w-3" />
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

    </DashboardLayout>
    </SessionGuard>
  )
}
