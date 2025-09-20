"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Calendar,
  Clock,
  Coins,
  Gift,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileData {
  credits: number;
  referral_code: string;
  address: any;
  phone: string;
}

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedSessions: number;
  totalReferrals: number;
  pendingReviews: number;
  recentActivity: Array<{
    id: string;
    type: "booking" | "referral" | "review" | "credit";
    description: string;
    date: string;
    amount?: number;
  }>;
}

interface OverviewProps {
  user: User;
  profileData: ProfileData;
  onRefresh: () => void;
}

export function Overview({ user, profileData, onRefresh }: OverviewProps) {
  const supabase = createBrowserSupabaseClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [user.id]);

  const loadDashboardStats = async () => {
    try {
      // Load bookings data
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, date_time, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Load referrals data
      const { data: referrals } = await supabase
        .from("referrals")
        .select("id, status, created_at, invitee_email")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      // Load reviews data
      const { data: reviews } = await supabase
        .from("reviews")
        .select("id, rating, created_at, booking_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const now = new Date();
      const upcomingBookings =
        bookings?.filter(
          (b) => new Date(b.date_time) > now && !["cancelled", "no_show"].includes(b.status)
        ) || [];

      const completedSessions = bookings?.filter((b) => b.status === "completed") || [];

      const pendingReviews =
        bookings?.filter(
          (b) => b.status === "completed" && !reviews?.some((r) => r.booking_id === b.id)
        ) || [];

      // Create recent activity timeline
      const recentActivity = [];

      // Add recent bookings
      bookings?.slice(0, 3).forEach((booking) => {
        recentActivity.push({
          id: booking.id,
          type: "booking" as const,
          description: `${booking.status === "completed" ? "Completed" : "Scheduled"} recovery session`,
          date: booking.created_at,
        });
      });

      // Add recent referrals
      referrals?.slice(0, 2).forEach((referral) => {
        recentActivity.push({
          id: referral.id,
          type: "referral" as const,
          description: `Referred ${referral.invitee_email}`,
          date: referral.created_at,
          amount: referral.status === "first_booking" ? 50 : undefined,
        });
      });

      // Add recent reviews
      reviews?.slice(0, 2).forEach((review) => {
        recentActivity.push({
          id: review.id,
          type: "review" as const,
          description: `Left ${review.rating}-star review`,
          date: review.created_at,
        });
      });

      // Sort by date
      recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setStats({
        totalBookings: bookings?.length || 0,
        upcomingBookings: upcomingBookings.length,
        completedSessions: completedSessions.length,
        totalReferrals: referrals?.length || 0,
        pendingReviews: pendingReviews.length,
        recentActivity: recentActivity.slice(0, 5),
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressToNextReward = () => {
    const completedSessions = stats?.completedSessions || 0;
    const nextMilestone = Math.ceil((completedSessions + 1) / 5) * 5;
    const progress = ((completedSessions % 5) / 5) * 100;
    return { progress, nextMilestone, sessionsLeft: nextMilestone - completedSessions };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return Calendar;
      case "referral":
        return Users;
      case "review":
        return Star;
      case "credit":
        return Coins;
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const rewardProgress = getProgressToNextReward();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.user_metadata?.full_name || "Recovery Member"}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your recovery journey overview</p>
        </div>
        <Button asChild>
          <Link href="/book">
            <Plus className="w-4 h-4 mr-2" />
            Book Session
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">{profileData.credits}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.upcomingBookings || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.completedSessions || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.totalReferrals || 0}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your recovery journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/book">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Session
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/profile?tab=referrals">
                <Gift className="w-4 h-4 mr-2" />
                Invite Friends (Earn $50)
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            {stats && stats.pendingReviews > 0 && (
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/profile?tab=reviews">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Sessions ({stats.pendingReviews})
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Loyalty Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Rewards</CardTitle>
            <CardDescription>Progress to your next reward milestone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Sessions completed</span>
              <span>
                {stats?.completedSessions || 0} / {rewardProgress.nextMilestone}
              </span>
            </div>
            <Progress value={rewardProgress.progress} className="h-2" />
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {rewardProgress.sessionsLeft} more sessions to earn bonus credits!
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest recovery journey updates</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity.length ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                    </div>
                    {activity.amount && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +{activity.amount} credits
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity yet</p>
              <p className="text-sm">Start your recovery journey by booking your first session!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
