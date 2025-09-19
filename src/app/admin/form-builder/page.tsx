"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  GripVertical, 
  Type, 
  Mail, 
  Phone, 
  Calendar, 
  CheckSquare, 
  List, 
  FileText,
  Settings,
  Copy,
  Move
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SessionGuard from "@/components/auth/session-guard"

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  position: { x: number; y: number }
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
    googleSheets?: {
      enabled?: boolean
      spreadsheetId?: string
      sheetName?: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
  { type: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
  { type: 'phone', label: 'Phone', icon: Phone, description: 'Phone number input' },
  { type: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { type: 'select', label: 'Dropdown', icon: List, description: 'Select from options' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Multiple selection' },
  { type: 'radio', label: 'Radio', icon: CheckSquare, description: 'Single selection' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker' },
  { type: 'number', label: 'Number', icon: Type, description: 'Numeric input' }
]

function FormBuilderContent() {
  const searchParams = useSearchParams()
  const formId = searchParams.get('id')
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formConfig, setFormConfig] = useState<FormConfig>({
    id: `form-${Date.now()}`,
    name: 'New Form',
    description: 'Custom lead capture form',
    fields: [],
    settings: {
      allowMultipleSubmissions: true,
      successMessage: 'Thank you for your submission!'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [draggedField, setDraggedField] = useState<FormField | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showFormSettings, setShowFormSettings] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load existing form data when formId is provided (but not 'new')
  useEffect(() => {
    if (mounted && formId && formId !== 'new') {
      loadExistingForm(formId)
    }
  }, [mounted, formId])

  const loadExistingForm = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/forms/${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormConfig({
          ...data,
          fields: data.fields || [],
          settings: data.settings || {
            allowMultipleSubmissions: true,
            successMessage: 'Thank you for your submission!'
          }
        })
      } else {
        console.error('Failed to load form data')
        alert('Failed to load form data')
      }
    } catch (error) {
      console.error('Error loading form:', error)
      alert('Error loading form')
    } finally {
      setIsLoading(false)
    }
  }

  const addField = useCallback((fieldType: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as FormField['type'],
      label: `New ${fieldType} Field`,
      placeholder: `Enter ${fieldType}...`,
      required: false,
      position: { x: 0, y: formConfig.fields.length * 80 }
    }

    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
      newField.options = ['Option 1', 'Option 2', 'Option 3']
    }

    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }, [formConfig.fields.length])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
    
    // Update selectedField if it's the one being updated
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [selectedField])

  const deleteField = useCallback((fieldId: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }, [selectedField])

  const duplicateField = useCallback((field: FormField) => {
    const newField: FormField = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (Copy)`,
      position: { x: field.position.x + 20, y: field.position.y + 20 }
    }
    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }, [])

  const moveField = useCallback((fieldId: string, newPosition: { x: number; y: number }) => {
    updateField(fieldId, { position: newPosition })
  }, [updateField])

  const saveForm = async () => {
    try {
      const isUpdate = formId && formId !== 'new'
      const url = isUpdate ? `/api/forms/${formId}` : '/api/forms'
      const method = isUpdate ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formConfig,
          updatedAt: new Date()
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (!isUpdate && data.id) {
          // Update the form ID for new forms
          setFormConfig(prev => ({ ...prev, id: data.id }))
          // Update the URL to include the new form ID
          window.history.replaceState({}, '', `/admin/form-builder?id=${data.id}`)
        }
        alert(`Form ${isUpdate ? 'updated' : 'saved'} successfully!`)
      } else {
        alert(`Error ${isUpdate ? 'updating' : 'saving'} form`)
      }
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Error saving form')
    }
  }

  const renderFieldPreview = (field: FormField) => {
    const baseClasses = "w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        )
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            className={`${baseClasses} min-h-[80px] resize-none`}
            disabled
          />
        )
      case 'select':
        return (
          <select className={baseClasses} disabled>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="space-y-1">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 text-sm">
                <input type="radio" name={field.id} disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-1">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )
      case 'date':
        return (
          <Input
            type="date"
            className={baseClasses}
            disabled
          />
        )
      default:
        return <div className={baseClasses}>Unknown field type</div>
    }
  }

  if (!mounted) {
    return (
      <DashboardLayout
        title="Form Builder"
        subtitle="Create custom lead capture forms with drag and drop"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form builder...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="Form Builder"
        subtitle="Create custom lead capture forms with drag and drop"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <SessionGuard>
      <DashboardLayout
        title="Form Builder"
        subtitle="Create custom lead capture forms with drag and drop"
      >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-200px)]">
        {/* Field Palette */}
        <div className="lg:col-span-1">
          <Card className="h-fit max-h-[calc(100vh-250px)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Field Types</CardTitle>
              <CardDescription className="text-gray-700 font-medium">Drag fields to the canvas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto max-h-[calc(100vh-400px)]">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon
                return (
                  <div
                    key={fieldType.type}
                    className="p-3 border border-gray-300 rounded-lg cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors bg-white"
                    draggable
                    onDragStart={() => setDraggedField({
                      id: `temp-${Date.now()}`,
                      type: fieldType.type as FormField['type'],
                      label: fieldType.label,
                      placeholder: `Enter ${fieldType.type}...`,
                      required: false,
                      position: { x: 0, y: 0 }
                    })}
                    onClick={() => addField(fieldType.type)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{fieldType.label}</p>
                        <p className="text-xs text-gray-600">{fieldType.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Form Canvas */}
        <div className="lg:col-span-2">
          <Card className="h-fit min-h-[calc(100vh-250px)]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Form Canvas</CardTitle>
                  <CardDescription className="text-gray-700 font-medium">Build your form by adding fields</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFormSettings(!showFormSettings)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Form Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreviewMode ? 'Edit' : 'Preview'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveForm}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : (formId && formId !== 'new' ? 'Update Form' : 'Save Form')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(100vh-400px)]">
              <div className="space-y-4">
                {/* Form Settings Panel */}
                {showFormSettings && (
                  <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Form Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="form-name" className="text-sm font-semibold text-gray-900">Form Name</Label>
                        <Input
                          id="form-name"
                          value={formConfig.name}
                          onChange={(e) => setFormConfig(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="form-description" className="text-sm font-semibold text-gray-900">Description</Label>
                        <Input
                          id="form-description"
                          value={formConfig.description}
                          onChange={(e) => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="success-message" className="text-sm font-semibold text-gray-900">Success Message</Label>
                        <Input
                          id="success-message"
                          value={formConfig.settings.successMessage || ''}
                          onChange={(e) => setFormConfig(prev => ({ 
                            ...prev, 
                            settings: { ...prev.settings, successMessage: e.target.value }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="redirect-url" className="text-sm font-semibold text-gray-900">Redirect URL (optional)</Label>
                        <Input
                          id="redirect-url"
                          value={formConfig.settings.redirectUrl || ''}
                          onChange={(e) => setFormConfig(prev => ({ 
                            ...prev, 
                            settings: { ...prev.settings, redirectUrl: e.target.value }
                          }))}
                          placeholder="https://example.com/thank-you"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allow-multiple"
                          checked={formConfig.settings.allowMultipleSubmissions}
                          onChange={(e) => setFormConfig(prev => ({ 
                            ...prev, 
                            settings: { ...prev.settings, allowMultipleSubmissions: e.target.checked }
                          }))}
                        />
                        <Label htmlFor="allow-multiple" className="text-sm font-semibold text-gray-900">Allow multiple submissions</Label>
                      </div>
                      
                      {/* Google Sheets Integration */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-md font-bold text-gray-900 mb-3">Google Sheets Integration</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="google-sheets-enabled"
                              checked={formConfig.settings.googleSheets?.enabled || false}
                              onChange={(e) => setFormConfig(prev => ({ 
                                ...prev, 
                                settings: { 
                                  ...prev.settings, 
                                  googleSheets: { 
                                    ...prev.settings.googleSheets, 
                                    enabled: e.target.checked 
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="google-sheets-enabled" className="text-sm font-semibold text-gray-900">Enable Google Sheets integration</Label>
                          </div>
                          
                          {formConfig.settings.googleSheets?.enabled && (
                            <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                              <div>
                                <Label htmlFor="sheet-id" className="text-sm font-semibold text-gray-900">Google Sheet ID</Label>
                                <Input
                                  id="sheet-id"
                                  value={formConfig.settings.googleSheets?.spreadsheetId || ''}
                                  onChange={(e) => setFormConfig(prev => ({ 
                                    ...prev, 
                                    settings: { 
                                      ...prev.settings, 
                                      googleSheets: { 
                                        ...prev.settings.googleSheets, 
                                        spreadsheetId: e.target.value 
                                      }
                                    }
                                  }))}
                                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                  className="mt-1"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                  Found in the Google Sheets URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
                                </p>
                              </div>
                              
                              <div>
                                <Label htmlFor="worksheet-title" className="text-sm font-semibold text-gray-900">Worksheet Title (optional)</Label>
                                <Input
                                  id="worksheet-title"
                                  value={formConfig.settings.googleSheets?.sheetName || ''}
                                  onChange={(e) => setFormConfig(prev => ({ 
                                    ...prev, 
                                    settings: { 
                                      ...prev.settings, 
                                      googleSheets: { 
                                        ...prev.settings.googleSheets, 
                                        sheetName: e.target.value 
                                      }
                                    }
                                  }))}
                                  placeholder="Form Submissions"
                                  className="mt-1"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                  Leave empty to use "Form Submissions" as default
                                </p>
                              </div>
                              
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 font-medium">
                                  <strong>Setup Required:</strong> Add these environment variables to your .env.local file:
                                </p>
                                <div className="mt-2 text-xs text-yellow-700 font-mono bg-yellow-100 p-2 rounded">
                                  <div>GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com</div>
                                  <div>GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"</div>
                                </div>
                              </div>
                              
                              {/* Test Google Sheets Integration */}
                              <div className="pt-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    const spreadsheetId = formConfig.settings.googleSheets?.spreadsheetId
                                    const sheetName = formConfig.settings.googleSheets?.sheetName
                                    
                                    if (!spreadsheetId) {
                                      alert('Please enter a Google Sheet ID first')
                                      return
                                    }
                                    
                                    try {
                                      const response = await fetch('/api/test-sheets-integration', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ spreadsheetId, sheetName })
                                      })
                                      
                                      const result = await response.json()
                                      
                                      if (result.success) {
                                        alert('✅ Google Sheets integration test successful!\n\nA test row has been added to your sheet to verify the connection works.')
                                      } else {
                                        alert(`❌ Google Sheets integration test failed:\n\n${result.message}\n\n${result.details ? JSON.stringify(result.details, null, 2) : ''}`)
                                      }
                                    } catch (error) {
                                      alert(`❌ Error testing Google Sheets integration:\n\n${error instanceof Error ? error.message : 'Unknown error'}`)
                                    }
                                  }}
                                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                  🧪 Test Google Sheets Integration
                                </Button>
                                <p className="text-xs text-gray-600 mt-1">
                                  Test if your Google Sheet is properly configured and accessible
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Header */}
                <div className="text-center p-4 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{formConfig.name}</h2>
                  <p className="text-gray-700 font-medium text-sm">{formConfig.description}</p>
                </div>

                {/* Form Fields */}
                {formConfig.fields.length === 0 ? (
                  <div className="text-center p-8 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50">
                    <p className="text-gray-700 mb-3 font-medium">No fields added yet</p>
                    <p className="text-sm text-gray-600">Drag fields from the left panel or click to add them</p>
                  </div>
                ) : (
                  formConfig.fields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-3 border rounded-lg transition-all mb-3 ${
                        selectedField?.id === field.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isPreviewMode ? 'cursor-default' : 'cursor-pointer'}`}
                      onClick={() => {
                        if (!isPreviewMode) {
                          setSelectedField(field)
                        }
                      }}
                    >
                      {!isPreviewMode && (
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <Badge variant="outline" className="text-xs font-semibold text-gray-700 border-gray-400">
                              {field.type}
                            </Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs font-semibold">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                duplicateField(field)
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteField(field.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <Label className="text-sm font-semibold text-gray-900">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      <div className="mt-1">
                        {renderFieldPreview(field)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Properties Panel */}
        <div className="lg:col-span-1">
          <Card className="h-fit max-h-[calc(100vh-250px)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Field Properties</CardTitle>
              <CardDescription className="text-gray-700 font-medium">
                {selectedField ? 'Edit selected field' : 'Select a field to edit'}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(100vh-400px)]">
              {selectedField ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="field-label" className="text-sm font-semibold text-gray-900">Label</Label>
                    <Input
                      id="field-label"
                      value={selectedField.label || ''}
                      onChange={(e) => {
                        const newValue = e.target.value
                        updateField(selectedField.id, { label: newValue })
                      }}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="field-placeholder" className="text-sm font-semibold text-gray-900">Placeholder</Label>
                    <Input
                      id="field-placeholder"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => {
                        const newValue = e.target.value
                        updateField(selectedField.id, { placeholder: newValue })
                      }}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="field-required"
                      checked={selectedField.required}
                      onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                    />
                    <Label htmlFor="field-required" className="text-sm font-semibold text-gray-900">Required field</Label>
                  </div>
                  
                  {(selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'checkbox') && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900">Options</Label>
                      <div className="space-y-2">
                        {selectedField.options?.map((option, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(selectedField.options || [])]
                                newOptions[index] = e.target.value
                                updateField(selectedField.id, { options: newOptions })
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newOptions = selectedField.options?.filter((_, i) => i !== index)
                                updateField(selectedField.id, { options: newOptions })
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(selectedField.options || []), 'New Option']
                            updateField(selectedField.id, { options: newOptions })
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-600 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">Select a field to edit its properties</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
    </SessionGuard>
  )
}

export default function FormBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form builder...</p>
        </div>
      </div>
    }>
      <FormBuilderContent />
    </Suspense>
  )
}
