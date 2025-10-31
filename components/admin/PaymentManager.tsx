"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  CreditCard,
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  user_id: string;
  bolt_checkout_id: string | null; // Legacy Bolt field
  stripe_session_id: string | null; // Stripe Checkout Session ID
  stripe_subscription_id: string | null; // Stripe Subscription ID
  stripe_payment_intent_id: string | null; // Stripe Payment Intent ID
  amount: number;
  setup_fee_applied: number;
  status: "pending" | "processing" | "paid" | "refunded" | "failed";
  order_type: "subscription" | "one_time" | "setup_fee";
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  customer_email?: string;
  customer_name?: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalOrders: number;
  activeSubscriptions: number;
  monthlyRecurring: number;
  averageOrderValue: number;
  refundRate: number;
}

export function PaymentManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);

      // Load orders and stats in parallel
      const [ordersResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/payments/orders"),
        fetch("/api/admin/payments/stats"),
      ]);

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to load payment data:", error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async (orderId: string, amount?: number) => {
    try {
      const response = await fetch("/api/payments/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          amount,
          reason: "admin_refund",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process refund");
      }

      toast({
        title: "Success",
        description: "Refund processed successfully",
      });

      // Reload data
      loadPaymentData();
    } catch (error) {
      console.error("Refund error:", error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    }
  };

  const exportPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments/export");

      if (!response.ok) {
        throw new Error("Failed to export payments");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `payments-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Payments exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export payments",
        variant: "destructive",
      });
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      refunded: "bg-red-100 text-red-800",
      failed: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      subscription: "bg-purple-100 text-purple-800",
      one_time: "bg-blue-100 text-blue-800",
      setup_fee: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || colors.one_time}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bolt_checkout_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesType = typeFilter === "all" || order.order_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading payment data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">{formatAmount(stats.totalRevenue)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Recurring</p>
                <p className="text-2xl font-bold">{formatAmount(stats.monthlyRecurring)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, emails, or checkout IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="one_time">One-time</SelectItem>
                <SelectItem value="setup_fee">Setup Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadPaymentData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button onClick={exportPayments} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.customer_email || order.metadata?.customer_email || "N/A"}
                    </div>
                    {order.customer_name && (
                      <div className="text-sm text-gray-500">{order.customer_name}</div>
                    )}
                  </div>
                </TableCell>

                <TableCell>{getTypeBadge(order.order_type)}</TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium">{formatAmount(order.amount)}</div>
                    {order.setup_fee_applied > 0 && (
                      <div className="text-sm text-gray-500">
                        Setup: {formatAmount(order.setup_fee_applied)}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(order.status)}</TableCell>

                <TableCell>{formatDate(order.created_at)}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Order ID</label>
                                <p className="font-mono text-sm">{selectedOrder.id}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Bolt Checkout ID</label>
                                <p className="font-mono text-sm">
                                  {selectedOrder.bolt_checkout_id || "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Amount</label>
                                <p>{formatAmount(selectedOrder.amount)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <p>{getStatusBadge(selectedOrder.status)}</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Metadata</label>
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(selectedOrder.metadata, null, 2)}
                              </pre>
                            </div>

                            {selectedOrder.status === "paid" && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={async () => processRefund(selectedOrder.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Process Full Refund
                                </Button>
                              </div>
                            )}
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found matching your criteria
          </div>
        )}
      </Card>
    </div>
  );
}
