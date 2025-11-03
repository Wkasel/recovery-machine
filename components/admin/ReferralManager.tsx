"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Referral {
  id: string;
  referrer_id: string;
  invitee_email: string;
  invitee_id?: string;
  status: "pending" | "signed_up" | "first_booking" | "expired";
  reward_credits: number;
  credits_awarded_at?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  referrer_email?: string;
  invitee_name?: string;
}

interface TopReferrer {
  referrer_id: string;
  referrer_email: string;
  total_referrals: number;
  successful_referrals: number;
  total_credits_earned: number;
  conversion_rate: number;
}

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  successful_referrals: number;
  expired_referrals: number;
  total_credits_awarded: number;
  average_conversion_rate: number;
}

export function ReferralManager() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      setLoading(true);

      const [referralsResponse, topReferrersResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/referrals"),
        fetch("/api/admin/referrals/top-referrers"),
        fetch("/api/admin/referrals/stats"),
      ]);

      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json();
        setReferrals(referralsData.referrals || []);
      }

      if (topReferrersResponse.ok) {
        const topReferrersData = await topReferrersResponse.json();
        setTopReferrers(topReferrersData.referrers || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to load referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReferrals = async () => {
    try {
      const response = await fetch("/api/admin/referrals/export");

      if (!response.ok) {
        throw new Error("Failed to export referrals");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `referrals-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Referrals exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export referrals",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-secondary/10 text-secondary-foreground border-secondary/20",
      signed_up: "bg-primary/20 text-primary border-primary/30",
      first_booking: "bg-primary/10 text-primary border-primary/20",
      expired: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || colors.pending}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      !searchTerm ||
      referral.referrer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.invitee_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || referral.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading referral data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referral Management</h1>
          <p className="text-muted-foreground">Track referral program performance and top referrers</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.total_referrals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active_referrals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">{stats.successful_referrals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Credits Awarded</p>
                <p className="text-2xl font-bold">{stats.total_credits_awarded}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.average_conversion_rate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold">{stats.expired_referrals}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Top Referrers */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
          <CardDescription>Most successful referral program participants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-accent/50 transition-colors border-border">
                <TableHead className="text-foreground font-semibold">Referrer</TableHead>
                <TableHead className="text-foreground font-semibold">Total Referrals</TableHead>
                <TableHead className="text-foreground font-semibold">Successful</TableHead>
                <TableHead className="text-foreground font-semibold">Conversion Rate</TableHead>
                <TableHead className="text-foreground font-semibold">Credits Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReferrers.map((referrer, index) => (
                <TableRow key={referrer.referrer_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <Trophy
                          className={`h-4 w-4 ${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                                ? "text-muted-foreground"
                                : "text-orange-600"
                          }`}
                        />
                      )}
                      <span className="font-medium">{referrer.referrer_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{referrer.total_referrals}</TableCell>
                  <TableCell>{referrer.successful_referrals}</TableCell>
                  <TableCell>{referrer.conversion_rate.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5">
                      {referrer.total_credits_earned} credits
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {topReferrers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No referrer data available</div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search referrals by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="signed_up">Signed Up</SelectItem>
                <SelectItem value="first_booking">First Booking</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadReferralData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button onClick={exportReferrals} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Referrals Table */}
      <Card className="border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-accent/50 transition-colors border-border">
              <TableHead className="text-foreground font-semibold">Referrer</TableHead>
              <TableHead className="text-foreground font-semibold">Invitee</TableHead>
              <TableHead className="text-foreground font-semibold">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Credits</TableHead>
              <TableHead className="text-foreground font-semibold">Created</TableHead>
              <TableHead className="text-foreground font-semibold">Expires</TableHead>
              <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReferrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  <div className="font-medium">{referral.referrer_email || "Unknown"}</div>
                </TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium">{referral.invitee_email}</div>
                    {referral.invitee_name && (
                      <div className="text-sm text-muted-foreground">{referral.invitee_name}</div>
                    )}
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(referral.status)}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{referral.reward_credits}</span>
                    {referral.credits_awarded_at && (
                      <Badge variant="outline" className="bg-primary/5 text-xs">
                        Awarded
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>{formatDate(referral.created_at)}</TableCell>

                <TableCell>
                  <span
                    className={new Date(referral.expires_at) < new Date() ? "text-red-600" : ""}
                  >
                    {formatDate(referral.expires_at)}
                  </span>
                </TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReferral(referral)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Referral Details</DialogTitle>
                        <DialogDescription>
                          View referral information and timeline
                        </DialogDescription>
                      </DialogHeader>

                      {selectedReferral && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Referrer</Label>
                              <p className="text-sm">{selectedReferral.referrer_email}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Invitee Email</Label>
                              <p className="text-sm">{selectedReferral.invitee_email}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Status</Label>
                              <div className="mt-1">{getStatusBadge(selectedReferral.status)}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Reward Credits</Label>
                              <p className="text-sm">{selectedReferral.reward_credits}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Created</Label>
                              <p className="text-sm">{formatDate(selectedReferral.created_at)}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Expires</Label>
                              <p className="text-sm">{formatDate(selectedReferral.expires_at)}</p>
                            </div>
                          </div>

                          {selectedReferral.credits_awarded_at && (
                            <div>
                              <Label className="text-sm font-medium">Credits Awarded</Label>
                              <p className="text-sm">
                                {formatDate(selectedReferral.credits_awarded_at)}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReferrals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No referrals found matching your criteria
          </div>
        )}
      </Card>
    </div>
  );
}
