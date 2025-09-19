'use client'

import { ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { DashboardTab } from '@/app/profile/page'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Calendar, 
  History, 
  Users, 
  Star, 
  Settings,
  ArrowLeft,
  Coins
} from 'lucide-react'
import Link from 'next/link'

interface ProfileData {
  credits: number
  referral_code: string
  address: any
  phone: string
}

interface DashboardLayoutProps {
  user: User
  profileData: ProfileData
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  children: ReactNode
}

export function DashboardLayout({
  user,
  profileData,
  activeTab,
  onTabChange,
  children
}: DashboardLayoutProps) {
  const getUserInitials = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
    }
    return user.email?.substring(0, 2).toUpperCase() || 'RM'
  }

  const tabs = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Dashboard home'
    },
    {
      id: 'bookings' as DashboardTab,
      label: 'Bookings',
      icon: Calendar,
      description: 'Manage sessions'
    },
    {
      id: 'history' as DashboardTab,
      label: 'History',
      icon: History,
      description: 'Past sessions'
    },
    {
      id: 'referrals' as DashboardTab,
      label: 'Referrals',
      icon: Users,
      description: 'Invite friends'
    },
    {
      id: 'reviews' as DashboardTab,
      label: 'Reviews',
      icon: Star,
      description: 'Rate sessions'
    },
    {
      id: 'settings' as DashboardTab,
      label: 'Settings',
      icon: Settings,
      description: 'Account settings'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            
            {/* User info and credits */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {profileData.credits} Credits
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'Recovery Member'}
                  </p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as DashboardTab)}>
            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <TabsList className="grid w-full grid-cols-6 bg-transparent border-0 p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 py-4 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700 rounded-none border-b-2 border-transparent"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 p-0">
                {tabs.slice(0, 3).map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Mobile overflow menu for remaining tabs */}
              <div className="grid grid-cols-3 mt-2 border-t pt-2">
                {tabs.slice(3).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center space-y-1 py-2 px-2 rounded ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="min-h-[600px] p-6">
          {children}
        </Card>
      </div>
    </div>
  )
}