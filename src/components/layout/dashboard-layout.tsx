"use client"

import { useCustomSession } from "@/components/providers/custom-session-provider"
import Sidebar from "./sidebar"
import { Bell, Plus, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { session, signOut } = useCustomSession()

  const handleSignOut = async () => {
    try {
      console.log('Signing out from header...')
      signOut()
      console.log('Sign out successful')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {title || 'Dashboard'}
                </h1>
                <p className="text-gray-700 mt-1 font-medium">
                  {subtitle || `Welcome back, ${session?.user?.name || session?.user?.email}!`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                
                {/* User Menu */}
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {session?.user?.name || session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 group"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4 group-hover:text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
