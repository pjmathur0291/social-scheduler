'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

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
  fields: FormField[]
  settings: {
    allowMultipleSubmissions?: boolean
    redirectUrl?: string
    successMessage?: string
    googleSheets?: {
      enabled?: boolean
      spreadsheetId?: string
      sheetName?: string
    }
  }
}

export default function EmbedFormPage() {
  const params = useParams()
  const formId = params.id as string
  
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/embed/form/${formId}`)
        const data = await response.json()
        
        if (data.success) {
          setFormConfig(data.form)
        } else {
          setError('Form not found')
        }
      } catch (err) {
        setError('Failed to load form')
        console.error('Error fetching form:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (formId) {
      fetchForm()
    }
  }, [formId])

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setError('')

    try {
      // Add UTM parameters and tracking data
      const urlParams = new URLSearchParams(window.location.search)
      const trackingData = {
        ...formData,
        formId: formConfig?.id,
        formName: formConfig?.name,
        timestamp: new Date().toISOString(),
        utmSource: urlParams.get('utm_source') || '',
        utmMedium: urlParams.get('utm_medium') || '',
        utmCampaign: urlParams.get('utm_campaign') || '',
        utmTerm: urlParams.get('utm_term') || '',
        utmContent: urlParams.get('utm_content') || '',
        utmId: urlParams.get('utm_id') || '',
        referrer: document.referrer || '',
        landingPage: window.location.href
      }

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        
        // Clear form data
        setFormData({})
        
        // Redirect if configured
        if (formConfig?.settings.redirectUrl) {
          setTimeout(() => {
            window.location.href = formConfig.settings.redirectUrl!
          }, 2000)
        }
      } else {
        setSubmitStatus('error')
        setError(result.message || 'Failed to submit form')
      }
    } catch (err) {
      setSubmitStatus('error')
      setError('Network error. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const fieldError = field.required && !formData[field.id] && submitStatus === 'error'

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
              required={field.required}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
              required={field.required}
              rows={4}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value: string) => handleFieldChange(field.id, value)}
            >
              <SelectTrigger className={fieldError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={formData[field.id] || false}
                onCheckedChange={(checked: boolean) => handleFieldChange(field.id, checked)}
              />
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
              <p className="text-gray-600">{error || 'The requested form could not be loaded.'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600">
                {formConfig.settings.successMessage || 'Your submission has been received successfully.'}
              </p>
              {formConfig.settings.redirectUrl && (
                <p className="text-sm text-gray-500 mt-2">
                  You will be redirected shortly...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {formConfig.name}
              </h1>
              <p className="text-gray-600">
                Please fill out the form below to get in touch with us.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {formConfig.fields.map(renderField)}

              {submitStatus === 'error' && error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
