"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  users: {
    total: number;
    monthly: number;
    growth: number;
  };
  bookings: {
    total: number;
    monthly: number;
    growth: number;
    pending: number;
    confirmed: number;
    completed: number;
  };
  reviews: {
    average: number;
    total: number;
    featured: number;
  };
  referrals: {
    active: number;
    converted: number;
    conversion_rate: number;
  };
}

interface RecentActivity {
  id: string;
  type: "booking" | "payment" | "review" | "referral";
  description: string;
  user_email: string;
  amount?: number;
  created_at: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [statsResponse, activityResponse] = await Promise.all([
        fetch("/api/admin/dashboard/stats"),
        fetch("/api/admin/dashboard/activity"),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activities || []);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
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
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "referral":
        return <UserPlus className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGrowthIndicator = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        <span className="text-sm font-medium">{Math.abs(growth)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your business overview</p>
        </div>

        <Button onClick={loadDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  This month: {formatCurrency(stats.revenue.monthly)}
                </p>
                {getGrowthIndicator(stats.revenue.growth)}
              </div>
            </CardContent>
          </Card>

          {/* Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  New this month: {stats.users.monthly}
                </p>
                {getGrowthIndicator(stats.users.growth)}
              </div>
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bookings.total}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  This month: {stats.bookings.monthly}
                </p>
                {getGrowthIndicator(stats.bookings.growth)}
              </div>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviews.average.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">From {stats.reviews.total} reviews</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Secondary Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge variant="outline" className="bg-yellow-50">
                  {stats.bookings.pending}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confirmed</span>
                <Badge variant="outline" className="bg-blue-50">
                  {stats.bookings.confirmed}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <Badge variant="outline" className="bg-green-50">
                  {stats.bookings.completed}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Referral Program */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Referral Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Referrals</span>
                <span className="font-semibold">{stats.referrals.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Converted</span>
                <span className="font-semibold">{stats.referrals.converted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-semibold">{stats.referrals.conversion_rate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Reviews</span>
                <span className="font-semibold">{stats.reviews.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Featured</span>
                <span className="font-semibold">{stats.reviews.featured}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{stats.reviews.average.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest business activities and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <span className="text-sm">{activity.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{activity.user_email}</TableCell>
                    <TableCell>{activity.amount ? formatCurrency(activity.amount) : "-"}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(activity.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">No recent activity found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
