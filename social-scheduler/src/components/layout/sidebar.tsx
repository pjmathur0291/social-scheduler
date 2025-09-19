"use client"

import { useCustomSession } from "@/components/providers/custom-session-provider"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Plus, 
  BarChart, 
  Users, 
  Settings, 
  Bell, 
  Home,
  FileText,
  Clock,
  Target,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Create Post', href: '/posts/create', icon: Plus },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Accounts', href: '/accounts', icon: Users },
  { name: 'Scheduled', href: '/scheduled', icon: Clock },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Lead Form', href: '/leads', icon: Target },
  { name: 'Leads Management', href: '/admin/leads', icon: Users },
  { name: 'Form Builder', href: '/admin/form-builder', icon: FileText },
  { name: 'Forms Management', href: '/admin/forms', icon: Settings },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const { session, signOut } = useCustomSession()
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      console.log('Signing out...')
      signOut()
      console.log('Sign out successful')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white/90 backdrop-blur-md border-r border-gray-200/50 flex flex-col h-screen sticky top-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Social Scheduler
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Test Navigation Button */}
        <button
          onClick={() => {
            console.log('TEST: Direct window.location navigation to /settings')
            window.location.href = '/settings'
          }}
          className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 mb-2"
        >
          🧪 TEST: Go to Settings
        </button>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.name}
              onClick={(e) => {
                e.preventDefault()
                console.log(`Navigating to: ${item.href}`)
                console.log(`Current pathname: ${pathname}`)
                console.log(`Router object:`, router)
                
                // Direct window.location navigation
                console.log('Using direct window.location.href')
                window.location.href = item.href
              }}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full text-left ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
              {!collapsed && <span>{item.name}</span>}
            </button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200/50">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {(session?.user?.name || session?.user?.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-xs text-gray-500">Online</p>
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
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {(session?.user?.name || session?.user?.email)?.charAt(0).toUpperCase()}
              </span>
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
        )}
      </div>
    </div>
  )
}
