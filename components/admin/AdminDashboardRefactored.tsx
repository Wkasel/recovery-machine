"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Stack, Grid, Flex } from "@/components/ui/layout";
import { SkeletonDashboard } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/typography/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/lib/hooks/use-toast";
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
        return <Calendar className="h-4 w-4 text-primary" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-primary" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "referral":
        return <UserPlus className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getGrowthIndicator = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <Flex 
        align="center" 
        gap="xs" 
        className={isPositive ? "text-primary" : "text-red-600"}
      >
        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        <Text size="sm" weight="medium">{Math.abs(growth)}%</Text>
      </Flex>
    );
  };

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <Container size="full" padding="none">
      <Stack spacing="xl">
        {/* Header */}
        <Flex justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <Stack spacing="sm">
            <Heading size="display-sm" weight="bold" color="default">
              Dashboard
            </Heading>
            <Text variant="large" color="muted">
              Welcome to your business overview
            </Text>
          </Stack>

          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            size="default"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            className="hover:scale-105 transition-transform"
          >
            Refresh
          </Button>
        </Flex>

        {/* Key Metrics */}
        {stats && (
          <Grid responsive="dashboard" gap="lg">
            {/* Revenue */}
            <Card 
              variant="elevated" 
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <CardHeader padding="lg" spacing="none">
                <Flex justify="between" align="center">
                  <Text variant="small" weight="medium" color="muted">
                    Total Revenue
                  </Text>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </Flex>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="sm">
                <Heading size="lg" weight="bold">
                  {formatCurrency(stats.revenue.total)}
                </Heading>
                <Flex justify="between" align="center">
                  <Text size="xs" color="muted">
                    This month: {formatCurrency(stats.revenue.monthly)}
                  </Text>
                  {getGrowthIndicator(stats.revenue.growth)}
                </Flex>
              </CardContent>
            </Card>

            {/* Users */}
            <Card 
              variant="elevated" 
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <CardHeader padding="lg" spacing="none">
                <Flex justify="between" align="center">
                  <Text variant="small" weight="medium" color="muted">
                    Total Users
                  </Text>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </Flex>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="sm">
                <Heading size="lg" weight="bold">
                  {stats.users.total.toLocaleString()}
                </Heading>
                <Flex justify="between" align="center">
                  <Text size="xs" color="muted">
                    New this month: {stats.users.monthly}
                  </Text>
                  {getGrowthIndicator(stats.users.growth)}
                </Flex>
              </CardContent>
            </Card>

            {/* Bookings */}
            <Card 
              variant="elevated" 
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <CardHeader padding="lg" spacing="none">
                <Flex justify="between" align="center">
                  <Text variant="small" weight="medium" color="muted">
                    Bookings
                  </Text>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </Flex>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="sm">
                <Heading size="lg" weight="bold">
                  {stats.bookings.total}
                </Heading>
                <Flex justify="between" align="center">
                  <Text size="xs" color="muted">
                    This month: {stats.bookings.monthly}
                  </Text>
                  {getGrowthIndicator(stats.bookings.growth)}
                </Flex>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card 
              variant="elevated" 
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <CardHeader padding="lg" spacing="none">
                <Flex justify="between" align="center">
                  <Text variant="small" weight="medium" color="muted">
                    Avg Rating
                  </Text>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </Flex>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="sm">
                <Heading size="lg" weight="bold">
                  {stats.reviews.average.toFixed(1)}
                </Heading>
                <Text size="xs" color="muted">
                  From {stats.reviews.total} reviews
                </Text>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Secondary Metrics */}
        {stats && (
          <Grid responsive="admin" gap="lg">
            {/* Booking Status */}
            <Card variant="default" className="hover:shadow-md transition-shadow duration-200">
              <CardHeader padding="lg" spacing="md">
                <Heading size="md" weight="semibold">
                  Booking Status
                </Heading>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="md">
                <Stack spacing="md">
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Pending</Text>
                    <Badge variant="warning">
                      {stats.bookings.pending}
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Confirmed</Text>
                    <Badge variant="info">
                      {stats.bookings.confirmed}
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Completed</Text>
                    <Badge variant="success">
                      {stats.bookings.completed}
                    </Badge>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>

            {/* Referral Program */}
            <Card variant="default" className="hover:shadow-md transition-shadow duration-200">
              <CardHeader padding="lg" spacing="md">
                <Heading size="md" weight="semibold">
                  Referral Program
                </Heading>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="md">
                <Stack spacing="md">
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Active Referrals</Text>
                    <Text weight="semibold">{stats.referrals.active}</Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Converted</Text>
                    <Text weight="semibold">{stats.referrals.converted}</Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Conversion Rate</Text>
                    <Text weight="semibold">{stats.referrals.conversion_rate}%</Text>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card variant="default" className="hover:shadow-md transition-shadow duration-200">
              <CardHeader padding="lg" spacing="md">
                <Heading size="md" weight="semibold">
                  Reviews
                </Heading>
              </CardHeader>
              <CardContent padding="lg-top-0" spacing="md">
                <Stack spacing="md">
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Total Reviews</Text>
                    <Text weight="semibold">{stats.reviews.total}</Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Featured</Text>
                    <Text weight="semibold">{stats.reviews.featured}</Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="sm" color="muted">Avg Rating</Text>
                    <Flex align="center" gap="xs">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Text weight="semibold">{stats.reviews.average.toFixed(1)}</Text>
                    </Flex>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Activity */}
        <Card variant="default" className="hover:shadow-md transition-shadow duration-200">
          <CardHeader padding="lg" spacing="md">
            <Heading size="lg" weight="semibold">
              Recent Activity
            </Heading>
            <Text variant="muted">
              Latest business activities and transactions
            </Text>
          </CardHeader>
          <CardContent padding="lg-top-0">
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
                    <TableRow 
                      key={activity.id}
                      className="hover:bg-muted/50 transition-colors duration-150"
                    >
                      <TableCell>
                        <Flex align="center" gap="md">
                          {getActivityIcon(activity.type)}
                          <Text size="sm">{activity.description}</Text>
                        </Flex>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">{activity.user_email}</Text>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" weight="medium">
                          {activity.amount ? formatCurrency(activity.amount) : "-"}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" color="muted">
                          {formatDate(activity.created_at)}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Text color="muted" size="lg">
                  No recent activity found
                </Text>
              </div>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}