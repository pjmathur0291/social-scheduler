"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Phone, Calendar, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Thank You for Your Interest!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              We've received your information and will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Our team is reviewing your requirements and will prepare a customized solution for your social media needs.
              </p>
            </div>

            {/* What happens next */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review & Analysis</p>
                    <p className="text-sm text-gray-600">We'll analyze your requirements and prepare a customized proposal.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Personal Contact</p>
                    <p className="text-sm text-gray-600">Our team will reach out within 24 hours to discuss your needs.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Custom Solution</p>
                    <p className="text-sm text-gray-600">We'll present a tailored social media management plan for your business.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Email Us</p>
                <p className="text-xs text-gray-600">hello@socialscheduler.com</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Call Us</p>
                <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Schedule Demo</p>
                <p className="text-xs text-gray-600">Book a call</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                <Link href="/">
                  <Zap className="w-4 h-4 mr-2" />
                  Explore Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50">
                <Link href="/leads">
                  Submit Another Request
                </Link>
              </Button>
            </div>

            {/* Additional Resources */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">While you wait, check out:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  📚 Social Media Tips & Best Practices
                </Link>
                <Link href="/pricing" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  💰 Our Pricing Plans
                </Link>
                <Link href="/features" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  ✨ Platform Features
                </Link>
                <Link href="/case-studies" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  📊 Success Stories
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
