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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye,
  Edit,
  CreditCard,
  Users,
  Plus,
  Minus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  phone?: string;
  address: any;
  referral_code: string;
  credits: number;
  created_at: string;
  updated_at: string;
  order_count?: number;
  booking_count?: number;
  total_spent?: number;
}

interface CreditTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

export function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [creditType, setCreditType] = useState<'add' | 'subtract'>('add');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/transactions`);
      
      if (response.ok) {
        const data = await response.json();
        setCreditTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load credit transactions',
        variant: 'destructive',
      });
    }
  };

  const adjustCredits = async () => {
    if (!selectedUser || !creditAmount) return;

    try {
      const amount = parseInt(creditAmount);
      const finalAmount = creditType === 'subtract' ? -amount : amount;

      const response = await fetch(`/api/admin/users/${selectedUser.id}/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          reason: creditReason || `Manual ${creditType} by admin`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adjust credits');
      }

      toast({
        title: 'Success',
        description: `Credits ${creditType === 'add' ? 'added' : 'subtracted'} successfully`,
      });

      // Reset form and reload data
      setCreditAmount('');
      setCreditReason('');
      setCreditDialogOpen(false);
      loadUsers();
      if (selectedUser) {
        loadUserTransactions(selectedUser.id);
      }

    } catch (error) {
      console.error('Credit adjustment error:', error);
      toast({
        title: 'Error',
        description: 'Failed to adjust credits',
        variant: 'destructive',
      });
    }
  };

  const exportUsers = async () => {
    try {
      const response = await fetch('/api/admin/users/export');
      
      if (!response.ok) {
        throw new Error('Failed to export users');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Users exported successfully',
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export users',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    !searchTerm || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referral_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage customer profiles and credits</p>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by email, phone, or referral code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button onClick={exportUsers} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Credits</p>
              <p className="text-2xl font-bold">
                {users.reduce((sum, user) => sum + user.credits, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">
                {users.filter(user => (user.booking_count || 0) > 0).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      Code: {user.referral_code}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    <div>{user.phone || 'No phone'}</div>
                    <div className="text-gray-500">
                      {user.address?.city ? `${user.address.city}, ${user.address.state}` : 'No address'}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="bg-green-50">
                    {user.credits} credits
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    <div>{user.booking_count || 0} bookings</div>
                    <div className="text-gray-500">
                      {user.total_spent ? formatCurrency(user.total_spent) : '$0'} spent
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>{formatDate(user.created_at)}</TableCell>
                
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            loadUserTransactions(user.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>User Details: {selectedUser?.email}</DialogTitle>
                          <DialogDescription>
                            View and manage user information
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedUser && (
                          <div className="space-y-6">
                            {/* User Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm">{selectedUser.email}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Phone</Label>
                                <p className="text-sm">{selectedUser.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Credits</Label>
                                <p className="text-sm font-bold">{selectedUser.credits}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Referral Code</Label>
                                <p className="text-sm font-mono">{selectedUser.referral_code}</p>
                              </div>
                            </div>

                            {/* Credit Management */}
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Credit Management</h3>
                                <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button size="sm">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Adjust Credits
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Adjust Credits</DialogTitle>
                                      <DialogDescription>
                                        Add or subtract credits for this user
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Action</Label>
                                        <Select value={creditType} onValueChange={(value: 'add' | 'subtract') => setCreditType(value)}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="add">Add Credits</SelectItem>
                                            <SelectItem value="subtract">Subtract Credits</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div>
                                        <Label>Amount</Label>
                                        <Input
                                          type="number"
                                          value={creditAmount}
                                          onChange={(e) => setCreditAmount(e.target.value)}
                                          placeholder="Enter amount"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label>Reason</Label>
                                        <Textarea
                                          value={creditReason}
                                          onChange={(e) => setCreditReason(e.target.value)}
                                          placeholder="Reason for adjustment"
                                        />
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <Button onClick={adjustCredits} className="flex-1">
                                          {creditType === 'add' ? <Plus className="h-4 w-4 mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
                                          {creditType === 'add' ? 'Add' : 'Subtract'} Credits
                                        </Button>
                                        <Button variant="outline" onClick={() => setCreditDialogOpen(false)}>
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>

                              {/* Credit Transactions */}
                              <div className="max-h-60 overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Description</TableHead>
                                      <TableHead>Date</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {creditTransactions.map((transaction) => (
                                      <TableRow key={transaction.id}>
                                        <TableCell>
                                          <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                                          </span>
                                        </TableCell>
                                        <TableCell>{transaction.transaction_type}</TableCell>
                                        <TableCell className="text-sm">{transaction.description}</TableCell>
                                        <TableCell className="text-sm">{formatDate(transaction.created_at)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                
                                {creditTransactions.length === 0 && (
                                  <div className="text-center py-4 text-gray-500">
                                    No credit transactions found
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search
          </div>
        )}
      </Card>
    </div>
  );
}