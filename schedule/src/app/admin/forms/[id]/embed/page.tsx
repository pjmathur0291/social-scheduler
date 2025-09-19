'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SessionGuard from "@/components/auth/session-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Code, Eye, ExternalLink, Settings } from "lucide-react"
import { useCustomSession } from "@/components/providers/custom-session-provider"

interface FormConfig {
  id: string
  name: string
  description: string
  fields: any[]
  settings: any
}

export default function EmbedPage() {
  const params = useParams()
  const formId = params.id as string
  const { session } = useCustomSession()
  
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [embedType, setEmbedType] = useState('iframe')
  const [embedWidth, setEmbedWidth] = useState('100%')
  const [embedHeight, setEmbedHeight] = useState('600px')
  const [embedTheme, setEmbedTheme] = useState('light')
  const [embedHideHeader, setEmbedHideHeader] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}`)
        const data = await response.json()
        
        if (response.ok && data.id) {
          setFormConfig(data)
        } else {
          setError('Form not found')
        }
      } catch (error) {
        console.error('Error fetching form:', error)
        setError('Failed to load form')
      } finally {
        setIsLoading(false)
      }
    }

    if (formId) {
      fetchForm()
    }
  }, [formId])

  // Generate embed code when form config or embed settings change
  useEffect(() => {
    if (!formConfig) return

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    let code = ''

    if (embedType === 'iframe') {
      code = `<!-- Social Scheduler Form Embed -->
<div id="social-scheduler-form-${formConfig.id}" style="min-width: 320px; height: ${embedHeight};"></div>
<script type="text/javascript" src="${baseUrl}/embed.js" async></script>
<script type="application/social-scheduler-embed">
{
  "type": "iframe",
  "formId": "${formConfig.id}",
  "containerId": "social-scheduler-form-${formConfig.id}",
  "width": "${embedWidth}",
  "height": "${embedHeight}",
  "theme": "${embedTheme}",
  "hideHeader": ${embedHideHeader}
}
</script>
<!-- Social Scheduler Form Embed End -->`
    } else {
      code = `<!-- Social Scheduler Inline Form -->
<div id="social-scheduler-form-${formConfig.id}"></div>
<script type="text/javascript" src="${baseUrl}/embed.js" async></script>
<script type="application/social-scheduler-embed">
{
  "type": "inline",
  "formId": "${formConfig.id}",
  "containerId": "social-scheduler-form-${formConfig.id}",
  "theme": "${embedTheme}"
}
</script>
<!-- Social Scheduler Inline Form End -->`
    }

    setGeneratedCode(code)
  }, [formConfig, embedType, embedWidth, embedHeight, embedTheme, embedHideHeader])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const previewUrl = formConfig ? `http://localhost:3000/embed/form/${formConfig.id}` : ''

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">The requested form could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <SessionGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Embed Form: {formConfig.name}</h1>
            <p className="text-gray-700 text-lg">
              Generate embed code to display your form on external websites
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Embed Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure how your form will appear when embedded
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="embed-type">Embed Type</Label>
                    <select
                      id="embed-type"
                      value={embedType}
                      onChange={(e) => setEmbedType(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="iframe">Iframe Embed</option>
                      <option value="inline">Inline Form</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-1">
                      {embedType === 'iframe' 
                        ? 'Form loads in an iframe (recommended for most websites)'
                        : 'Form renders directly in the page (better for styling control)'
                      }
                    </p>
                  </div>

                  {embedType === 'iframe' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          value={embedWidth}
                          onChange={(e) => setEmbedWidth(e.target.value)}
                          placeholder="100%"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          value={embedHeight}
                          onChange={(e) => setEmbedHeight(e.target.value)}
                          placeholder="600px"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      value={embedTheme}
                      onChange={(e) => setEmbedTheme(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="hideHeader">Hide Header</Label>
                      <p className="text-sm text-gray-600">Remove the form title and description</p>
                    </div>
                    <input
                      type="checkbox"
                      id="hideHeader"
                      checked={embedHideHeader}
                      onChange={(e) => setEmbedHideHeader(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    See how your form will look when embedded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formConfig.name}</Badge>
                      <Badge variant="secondary">{formConfig.fields.length} fields</Badge>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-700 mb-2 font-medium">Preview URL:</p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={previewUrl}
                          readOnly
                          className="text-sm bg-white text-gray-900"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(previewUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated Code */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Embed Code
                  </CardTitle>
                  <CardDescription>
                    Copy this code and paste it into your website's HTML
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Generated Embed Code</Label>
                      <Button
                        size="sm"
                        onClick={copyToClipboard}
                        className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </div>
                    
                    <Textarea
                      value={generatedCode}
                      readOnly
                      rows={12}
                      className="font-mono text-sm bg-gray-900 text-gray-100 border-gray-700"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">1. Copy the embed code</h4>
                    <p>Click the "Copy Code" button above to copy the generated HTML code.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">2. Paste into your website</h4>
                    <p>Paste the code into your website's HTML where you want the form to appear.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">3. Test the integration</h4>
                    <p>Visit your website to ensure the form loads and functions correctly.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">4. Track submissions</h4>
                    <p>Form submissions will be automatically tracked and sent to your configured Google Sheet.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SessionGuard>
  )
}