'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  RefreshCw, 
  Eye,
  UserPlus,
  Trophy,
  DollarSign,
  TrendingUp,
  Users,
  Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Referral {
  id: string;
  referrer_id: string;
  invitee_email: string;
  invitee_id?: string;
  status: 'pending' | 'signed_up' | 'first_booking' | 'expired';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      
      const [referralsResponse, topReferrersResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/referrals'),
        fetch('/api/admin/referrals/top-referrers'),
        fetch('/api/admin/referrals/stats'),
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
      console.error('Failed to load referral data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referral data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReferrals = async () => {
    try {
      const response = await fetch('/api/admin/referrals/export');
      
      if (!response.ok) {
        throw new Error('Failed to export referrals');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `referrals-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Referrals exported successfully',
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export referrals',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      signed_up: 'bg-blue-100 text-blue-800',
      first_booking: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = !searchTerm || 
      referral.referrer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.invitee_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;

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
          <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
          <p className="text-gray-600">Track referral program performance and top referrers</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.total_referrals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-bold">{stats.active_referrals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Successful</p>
                <p className="text-2xl font-bold">{stats.successful_referrals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Credits Awarded</p>
                <p className="text-2xl font-bold">{stats.total_credits_awarded}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.average_conversion_rate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expired</p>
                <p className="text-2xl font-bold">{stats.expired_referrals}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
          <CardDescription>Most successful referral program participants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Total Referrals</TableHead>
                <TableHead>Successful</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Credits Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReferrers.map((referrer, index) => (
                <TableRow key={referrer.referrer_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <Trophy className={`h-4 w-4 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 'text-orange-600'
                        }`} />
                      )}
                      <span className="font-medium">{referrer.referrer_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{referrer.total_referrals}</TableCell>
                  <TableCell>{referrer.successful_referrals}</TableCell>
                  <TableCell>{referrer.conversion_rate.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50">
                      {referrer.total_credits_earned} credits
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {topReferrers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No referrer data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer</TableHead>
              <TableHead>Invitee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReferrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  <div className="font-medium">
                    {referral.referrer_email || 'Unknown'}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <div className="font-medium">{referral.invitee_email}</div>
                    {referral.invitee_name && (
                      <div className="text-sm text-gray-500">{referral.invitee_name}</div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(referral.status)}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{referral.reward_credits}</span>
                    {referral.credits_awarded_at && (
                      <Badge variant="outline" className="bg-green-50 text-xs">
                        Awarded
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>{formatDate(referral.created_at)}</TableCell>
                
                <TableCell>
                  <span className={new Date(referral.expires_at) < new Date() ? 'text-red-600' : ''}>
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
                              <p className="text-sm">{formatDate(selectedReferral.credits_awarded_at)}</p>
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
          <div className="text-center py-8 text-gray-500">
            No referrals found matching your criteria
          </div>
        )}
      </Card>
    </div>
  );
}