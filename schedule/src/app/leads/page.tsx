"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, User, Mail, Phone, Building, Globe, MessageSquare, Target, Users, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    
    // Business Information
    businessType: "",
    industry: "",
    teamSize: "",
    currentSocialMedia: "",
    
    // Requirements
    platforms: [] as string[],
    postFrequency: "",
    budget: "",
    goals: "",
    challenges: "",
    timeline: "",
    
    // Additional Information
    currentTools: "",
    expectations: "",
    additionalInfo: "",
    
    // Marketing Preferences
    newsletter: false,
    updates: false,
    demo: false,
    
    // UTM Tracking
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
    utmId: "",
    referrer: "",
    landingPage: ""
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  // Capture UTM parameters and referrer on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const referrer = document.referrer || ''
      const landingPage = window.location.href

      setFormData(prev => ({
        ...prev,
        utmSource: urlParams.get('utm_source') || '',
        utmMedium: urlParams.get('utm_medium') || '',
        utmCampaign: urlParams.get('utm_campaign') || '',
        utmTerm: urlParams.get('utm_term') || '',
        utmContent: urlParams.get('utm_content') || '',
        utmId: urlParams.get('utm_id') || '',
        referrer: referrer,
        landingPage: landingPage
      }))
    }
  }, [])

  const platforms = [
    "Facebook", "Instagram", "Twitter/X", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Snapchat"
  ]

  const businessTypes = [
    "Startup", "Small Business", "Medium Business", "Enterprise", "Agency", "Freelancer", "Non-profit", "Other"
  ]

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail", "Food & Beverage", 
    "Travel & Tourism", "Real Estate", "Fashion", "Beauty", "Fitness", "Entertainment", "Other"
  ]

  const teamSizes = [
    "Just me", "2-5 people", "6-20 people", "21-50 people", "51-200 people", "200+ people"
  ]

  const postFrequencies = [
    "Daily", "2-3 times per week", "Weekly", "2-3 times per month", "Monthly", "As needed"
  ]

  const budgets = [
    "Under $500/month", "$500-$1,000/month", "$1,000-$2,500/month", 
    "$2,500-$5,000/month", "$5,000+/month", "Not sure yet"
  ]

  const timelines = [
    "ASAP", "Within 1 month", "Within 3 months", "Within 6 months", "Just exploring"
  ]

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, platform]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        platforms: prev.platforms.filter(p => p !== platform)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only submit if we're on step 4
    if (currentStep !== 4) {
      console.log("Form submitted but not on step 4, current step:", currentStep)
      return
    }
    
    console.log("Submitting form from step:", currentStep)
    setIsLoading(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to thank you page or dashboard
        router.push("/thank-you")
      } else {
        alert("There was an error submitting your form. Please try again.")
      }
    } catch (error) {
      alert("There was an error submitting your form. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    console.log("Next step clicked, current step:", currentStep)
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      console.log("Moving to step:", currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Get Started with Social Scheduler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your business and social media goals. We'll create a customized solution just for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Step {currentStep} of 4: {
                currentStep === 1 ? "Personal Information" :
                currentStep === 2 ? "Business Details" :
                currentStep === 3 ? "Requirements & Goals" :
                "Preferences & Submit"
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Debug: Current step is {currentStep}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && currentStep !== 4) {
            e.preventDefault()
            console.log("Enter pressed but not on step 4, preventing form submission")
          }
        }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Business Details"}
                {currentStep === 3 && "Requirements & Goals"}
                {currentStep === 4 && "Preferences & Submit"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Tell us about your business"}
                {currentStep === 3 && "What are your social media goals?"}
                {currentStep === 4 && "Final preferences and submit your request"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        placeholder="Enter your company name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select value={formData.businessType} onValueChange={(value: string) => setFormData({ ...formData, businessType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value: string) => setFormData({ ...formData, industry: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size *</Label>
                      <Select value={formData.teamSize} onValueChange={(value: string) => setFormData({ ...formData, teamSize: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamSizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentSocialMedia">Current Social Media Presence</Label>
                      <Input
                        id="currentSocialMedia"
                        placeholder="e.g., Facebook, Instagram, Twitter"
                        value={formData.currentSocialMedia}
                        onChange={(e) => setFormData({ ...formData, currentSocialMedia: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Requirements & Goals */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      Which social media platforms are you interested in? *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {platforms.map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform}
                            checked={formData.platforms.includes(platform)}
                            onCheckedChange={(checked: boolean) => handlePlatformChange(platform, checked)}
                          />
                          <Label htmlFor={platform} className="text-sm">{platform}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="postFrequency">How often do you want to post? *</Label>
                      <Select value={formData.postFrequency} onValueChange={(value: string) => setFormData({ ...formData, postFrequency: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {postFrequencies.map((freq) => (
                            <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Monthly Budget *</Label>
                      <Select value={formData.budget} onValueChange={(value: string) => setFormData({ ...formData, budget: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map((budget) => (
                            <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goals" className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      What are your main social media goals? *
                    </Label>
                    <Textarea
                      id="goals"
                      placeholder="e.g., Increase brand awareness, drive website traffic, generate leads, build community..."
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="challenges" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      What challenges are you facing with social media?
                    </Label>
                    <Textarea
                      id="challenges"
                      placeholder="e.g., Lack of time, inconsistent posting, low engagement, content creation..."
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      When do you want to get started? *
                    </Label>
                    <Select value={formData.timeline} onValueChange={(value: string) => setFormData({ ...formData, timeline: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map((timeline) => (
                          <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentTools">What tools are you currently using?</Label>
                    <Input
                      id="currentTools"
                      placeholder="e.g., Hootsuite, Buffer, Facebook Creator Studio..."
                      value={formData.currentTools}
                      onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectations" className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      What do you expect from our service?
                    </Label>
                    <Textarea
                      id="expectations"
                      placeholder="Tell us what you're looking for in a social media management solution..."
                      value={formData.expectations}
                      onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Anything else you'd like us to know?"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Communication Preferences</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={formData.newsletter}
                          onCheckedChange={(checked: boolean) => setFormData({ ...formData, newsletter: checked })}
                        />
                        <Label htmlFor="newsletter">Subscribe to our newsletter for social media tips</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="updates"
                          checked={formData.updates}
                          onCheckedChange={(checked: boolean) => setFormData({ ...formData, updates: checked })}
                        />
                        <Label htmlFor="updates">Receive product updates and new feature announcements</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="demo"
                          checked={formData.demo}
                          onCheckedChange={(checked: boolean) => setFormData({ ...formData, demo: checked })}
                        />
                        <Label htmlFor="demo">Schedule a personalized demo call</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
