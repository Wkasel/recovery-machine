// @ts-nocheck
"use client";

import { BookingsTab } from "@/components/dashboard/BookingsTab";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HistoryTab } from "@/components/dashboard/HistoryTab";
import { Overview } from "@/components/dashboard/Overview";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { ReferralsTab } from "@/components/dashboard/ReferralsTab";
import { ReviewsTab } from "@/components/dashboard/ReviewsTab";
import { ModuleErrorBoundary } from "@/components/error-boundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type DashboardTab =
  | "overview"
  | "bookings"
  | "history"
  | "referrals"
  | "reviews"
  | "settings";

interface ProfileData {
  credits: number;
  referral_code: string;
  address: any;
  phone: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const supabase = createBrowserSupabaseClient();

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  // Handle tab changes
  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  // Check authentication and load profile data
  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        // Redirect to booking page for guests to create account
        router.push("/book");
      } else {
        checkAuthAndLoadProfile();
      }
    }
  }, [authUser, authLoading]);

  const checkAuthAndLoadProfile = async () => {
    if (!authUser) return;

    try {
      setIsLoading(true);

      // Load profile data from users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("credits, referral_code, address, phone")
        .eq("id", authUser.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      // If profile doesn't exist or is missing data, create/update it
      if (!profile || !profile.referral_code) {
        const updatedProfile = await ensureProfile(authUser);
        setProfileData(updatedProfile);
      } else {
        setProfileData(profile);
      }
    } catch (error) {
      console.error("Profile load error:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ensureProfile = async (user: User): Promise<ProfileData> => {
    // Generate unique referral code if missing
    const referralCode = generateReferralCode();

    // Update user record with referral code if missing
    const { data, error } = await supabase
      .from("users")
      .update({
        referral_code: referralCode,
      })
      .eq("id", user.id)
      .select("credits, referral_code, address, phone")
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      // Return default values if update fails
      return {
        credits: 0,
        referral_code: referralCode,
        address: null,
        phone: "",
      };
    }

    return data;
  };

  const generateReferralCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const refreshProfileData = async () => {
    if (!authUser) return;

    const { data: profile } = await supabase
      .from("users")
      .select("credits, referral_code, address, phone")
      .eq("id", authUser.id)
      .single();

    if (profile) {
      setProfileData(profile);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-mint" />
          <p className="text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => window.location.reload()} className="flex-1 bg-charcoal hover:bg-charcoal/90 text-white rounded-full" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1 rounded-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser || !profileData) {
    return null;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview user={authUser} profileData={profileData} onRefresh={refreshProfileData} />;
      case "bookings":
        return <BookingsTab userId={authUser.id} onRefresh={refreshProfileData} />;
      case "history":
        return <HistoryTab userId={authUser.id} />;
      case "referrals":
        return (
          <ReferralsTab userId={authUser.id} referralCode={profileData.referral_code} onRefresh={refreshProfileData} />
        );
      case "reviews":
        return <ReviewsTab userId={authUser.id} />;
      case "settings":
        return (
          <ProfileSettings user={authUser} profileData={profileData} onUpdate={refreshProfileData} />
        );
      default:
        return null;
    }
  };

  return (
    <ModuleErrorBoundary>
      <DashboardLayout
        user={authUser}
        profileData={profileData}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {renderActiveTab()}
      </DashboardLayout>
    </ModuleErrorBoundary>
  );
}
