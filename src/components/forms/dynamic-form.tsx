"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, CheckCircle } from "lucide-react"

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

interface FormConfig {
  id: string
  name: string
  description: string
  fields: FormField[]
  settings: {
    allowMultipleSubmissions: boolean
    redirectUrl?: string
    successMessage?: string
  }
}

interface DynamicFormProps {
  formConfig: FormConfig
  onSuccess?: (data: any) => void
}

export default function DynamicForm({ formConfig, onSuccess }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
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

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`
    }

    if (value && field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be no more than ${field.validation.maxLength} characters`
      }
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return `${field.label} format is invalid`
      }
    }

    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    formConfig.fields.forEach(field => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formConfigId: formConfig.id,
          data: formData
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        if (onSuccess) {
          onSuccess(formData)
        }
        
        // Redirect if configured
        if (formConfig.settings.redirectUrl) {
          setTimeout(() => {
            router.push(formConfig.settings.redirectUrl!)
          }, 2000)
        }
      } else {
        alert('There was an error submitting your form. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('There was an error submitting your form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }))
    }
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id]
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
              rows={4}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        )

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={formData[field.id] || ''} onValueChange={(value: string) => handleFieldChange(field.id, value)}>
              <SelectTrigger className={fieldError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData[field.id]?.includes(option) || false}
                    onCheckedChange={(checked: boolean) => {
                      const currentValues = formData[field.id] || []
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option)
                      handleFieldChange(field.id, newValues)
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        )

      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        )

      default:
        return <div>Unknown field type: {field.type}</div>
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Submitted Successfully!</h2>
            <p className="text-gray-700 mb-6 font-medium">
              {formConfig.settings.successMessage || 'Thank you for your submission. We will get back to you soon.'}
            </p>
            {formConfig.settings.redirectUrl && (
              <p className="text-sm text-gray-600 font-medium">Redirecting you shortly...</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formConfig.name}
            </CardTitle>
            {formConfig.description && (
              <CardDescription className="text-gray-700 font-medium">
                {formConfig.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formConfig.fields.map((field) => (
                <div key={field.id}>
                  {renderField(field)}
                </div>
              ))}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? 'Submitting...' : 'Submit Form'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
