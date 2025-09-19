'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Overview } from '@/components/dashboard/Overview'
import { BookingsTab } from '@/components/dashboard/BookingsTab'
import { HistoryTab } from '@/components/dashboard/HistoryTab'
import { ReferralsTab } from '@/components/dashboard/ReferralsTab'
import { ReviewsTab } from '@/components/dashboard/ReviewsTab'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'
import { ModuleErrorBoundary } from '@/components/error-boundary'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export type DashboardTab = 'overview' | 'bookings' | 'history' | 'referrals' | 'reviews' | 'settings'

interface ProfileData {
  credits: number
  referral_code: string
  address: any
  phone: string
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  
  // Authentication and user state
  const [user, setUser] = useState<User | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  // Check authentication and load profile data
  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        throw authError
      }
      
      if (!user) {
        // Redirect to sign in with return URL
        router.push('/sign-in?redirect=/profile')
        return
      }
      
      setUser(user)
      
      // Load profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits, referral_code, address, phone')
        .eq('id', user.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }
      
      // If profile doesn't exist, create one
      if (!profile) {
        const newProfile = await createProfile(user)
        setProfileData(newProfile)
      } else {
        setProfileData(profile)
      }
      
    } catch (error) {
      console.error('Profile load error:', error)
      setError('Failed to load profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const createProfile = async (user: User): Promise<ProfileData> => {
    // Generate unique referral code
    const referralCode = generateReferralCode()
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        referral_code: referralCode,
        credits: 0,
        address: {},
        phone: ''
      })
      .select('credits, referral_code, address, phone')
      .single()
    
    if (error) {
      throw error
    }
    
    return data
  }

  const generateReferralCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const refreshProfileData = async () => {
    if (!user) return
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, referral_code, address, phone')
      .eq('id', user.id)
      .single()
    
    if (profile) {
      setProfileData(profile)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profileData) {
    return null
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            user={user}
            profileData={profileData}
            onRefresh={refreshProfileData}
          />
        )
      case 'bookings':
        return (
          <BookingsTab 
            user={user}
            onRefresh={refreshProfileData}
          />
        )
      case 'history':
        return (
          <HistoryTab 
            user={user}
          />
        )
      case 'referrals':
        return (
          <ReferralsTab 
            user={user}
            profileData={profileData}
            onRefresh={refreshProfileData}
          />
        )
      case 'reviews':
        return (
          <ReviewsTab 
            user={user}
          />
        )
      case 'settings':
        return (
          <ProfileSettings 
            user={user}
            profileData={profileData}
            onRefresh={refreshProfileData}
          />
        )
      default:
        return null
    }
  }

  return (
    <ModuleErrorBoundary>
      <DashboardLayout
        user={user}
        profileData={profileData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderActiveTab()}
      </DashboardLayout>
    </ModuleErrorBoundary>
  )
}