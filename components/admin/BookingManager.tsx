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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/lib/hooks/use-toast";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  user_id: string;
  order_id?: string;
  date_time: string;
  duration: number;
  add_ons: any;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  location_address: any;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_phone?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  user: string;
}

export function BookingManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      generateCalendarEvents();
    }
  }, [bookings, selectedDate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bookings");

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarEvents = () => {
    const events = bookings
      .filter((booking) => {
        const bookingDate = new Date(booking.date_time).toISOString().split("T")[0];
        return bookingDate === selectedDate;
      })
      .map((booking) => ({
        id: booking.id,
        title: `${booking.user_email || "Unknown"} - ${booking.status}`,
        start: new Date(booking.date_time),
        end: new Date(new Date(booking.date_time).getTime() + booking.duration * 60000),
        status: booking.status,
        user: booking.user_email || "Unknown",
      }));

    setCalendarEvents(events);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      toast({
        title: "Success",
        description: "Booking updated successfully",
      });

      loadBookings();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Booking update error:", error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const exportBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings/export");

      if (!response.ok) {
        throw new Error("Failed to export bookings");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `bookings-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Bookings exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export bookings",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: "bg-secondary/10 text-secondary-foreground border-secondary/20",
      confirmed: "bg-primary/10 text-primary border-primary/20",
      in_progress: "bg-secondary/20 text-secondary-foreground border-secondary/30",
      completed: "bg-primary/10 text-primary border-primary/20",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
      no_show: "bg-muted text-muted-foreground border-border",
    };

    const icons = {
      scheduled: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      in_progress: <AlertTriangle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      no_show: <XCircle className="h-4 w-4" />,
    };

    return (
      <Badge
        variant="outline"
        className={`${colors[status as keyof typeof colors] || colors.scheduled} flex items-center gap-1`}
      >
        {icons[status as keyof typeof icons]}
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      !searchTerm ||
      booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground">Manage appointments and schedule conflicts</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Booking List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {/* Controls */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bookings by email or ID..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={loadBookings} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>

                <Button onClick={exportBookings} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "scheduled").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card className="border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-accent/50 transition-colors border-border">
                  <TableHead className="text-foreground font-semibold">Customer</TableHead>
                  <TableHead className="text-foreground font-semibold">Date & Time</TableHead>
                  <TableHead className="text-foreground font-semibold">Duration</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold">Location</TableHead>
                  <TableHead className="text-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.user_email || "Unknown"}</div>
                        {booking.user_phone && (
                          <div className="text-sm text-muted-foreground">{booking.user_phone}</div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{formatDateTime(booking.date_time)}</div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm">{booking.duration} min</span>
                    </TableCell>

                    <TableCell>{getStatusBadge(booking.status)}</TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {booking.location_address?.city
                          ? `${booking.location_address.city}, ${booking.location_address.state}`
                          : "Not specified"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                              <DialogDescription>
                                View and manage booking information
                              </DialogDescription>
                            </DialogHeader>

                            {selectedBooking && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Customer</Label>
                                    <p className="text-sm">{selectedBooking.user_email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Phone</Label>
                                    <p className="text-sm">{selectedBooking.user_phone || "N/A"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Date & Time</Label>
                                    <p className="text-sm">
                                      {formatDateTime(selectedBooking.date_time)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <p className="text-sm">{selectedBooking.duration} minutes</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedBooking.status)}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Add-ons</Label>
                                    <p className="text-sm">
                                      {Object.keys(selectedBooking.add_ons || {}).length > 0
                                        ? JSON.stringify(selectedBooking.add_ons, null, 2)
                                        : "None"}
                                    </p>
                                  </div>
                                </div>

                                {selectedBooking.location_address && (
                                  <div>
                                    <Label className="text-sm font-medium">Location</Label>
                                    <div className="bg-muted/50 p-2 rounded text-sm">
                                      {selectedBooking.location_address.street && (
                                        <div>{selectedBooking.location_address.street}</div>
                                      )}
                                      {selectedBooking.location_address.city && (
                                        <div>
                                          {selectedBooking.location_address.city},{" "}
                                          {selectedBooking.location_address.state}{" "}
                                          {selectedBooking.location_address.zip}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {selectedBooking.special_instructions && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Special Instructions
                                    </Label>
                                    <p className="text-sm bg-muted/50 p-2 rounded">
                                      {selectedBooking.special_instructions}
                                    </p>
                                  </div>
                                )}

                                <div className="border-t pt-4">
                                  <Label className="text-sm font-medium">Update Status</Label>
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={async () =>
                                        updateBookingStatus(selectedBooking.id, "confirmed")
                                      }
                                      disabled={selectedBooking.status === "confirmed"}
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={async () =>
                                        updateBookingStatus(selectedBooking.id, "in_progress")
                                      }
                                      disabled={selectedBooking.status === "in_progress"}
                                    >
                                      Start
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={async () =>
                                        updateBookingStatus(selectedBooking.id, "completed")
                                      }
                                      disabled={selectedBooking.status === "completed"}
                                    >
                                      Complete
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={async () =>
                                        updateBookingStatus(selectedBooking.id, "cancelled")
                                      }
                                      disabled={selectedBooking.status === "cancelled"}
                                    >
                                      Cancel
                                    </Button>
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

            {filteredBookings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bookings found matching your criteria
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Schedule for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
              <CardDescription>{calendarEvents.length} bookings scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {calendarEvents.length > 0 ? (
                <div className="space-y-2">
                  {calendarEvents
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">
                            {formatTime(event.start.toISOString())} -{" "}
                            {formatTime(event.end.toISOString())}
                          </div>
                          <div className="text-sm">{event.user}</div>
                          {getStatusBadge(event.status)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const booking = bookings.find((b) => b.id === event.id);
                            if (booking) setSelectedBooking(booking);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings scheduled for this date
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
