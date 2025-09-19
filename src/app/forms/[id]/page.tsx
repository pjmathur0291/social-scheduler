"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import DynamicForm from "@/components/forms/dynamic-form"

interface FormConfig {
  id: string
  name: string
  description: string
  fields: any[]
  settings: any
}

export default function DynamicFormPage() {
  const params = useParams()
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchFormConfig(params.id as string)
    }
  }, [params.id])

  const fetchFormConfig = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      if (response.ok) {
        const data = await response.json()
        setFormConfig(data)
      } else if (response.status === 404) {
        setError("Form not found")
      } else {
        setError("Error loading form")
      }
    } catch (error) {
      console.error("Error fetching form config:", error)
      setError("Error loading form")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h2>
          <p className="text-gray-700 mb-6 font-medium">
            {error || "The form you're looking for doesn't exist or has been removed."}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return <DynamicForm formConfig={formConfig} />
}
