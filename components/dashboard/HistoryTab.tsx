'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Eye,
  Filter,
  Search,
  Receipt,
  DollarSign,
  History as HistoryIcon,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface BookingHistoryItem {
  id: string
  date_time: string
  duration: number
  add_ons: any
  status: string
  location_address: any
  special_instructions: string
  created_at: string
  updated_at: string
  order?: {
    id: string
    amount: number
    setup_fee_applied: number
    status: string
    bolt_checkout_id: string
    metadata: any
  }
  review?: {
    id: string
    rating: number
    comment: string
    created_at: string
  }
}

interface HistoryTabProps {
  user: User
}

export function HistoryTab({ user }: HistoryTabProps) {
  const supabase = createBrowserSupabaseClient()
  const [history, setHistory] = useState<BookingHistoryItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<BookingHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryItem | null>(null)
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)

  useEffect(() => {
    loadBookingHistory()
  }, [user.id])

  useEffect(() => {
    filterHistory()
  }, [history, searchTerm, statusFilter])

  const loadBookingHistory = async () => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          orders!left (
            id,
            amount,
            setup_fee_applied,
            status,
            bolt_checkout_id,
            metadata
          ),
          reviews!left (
            id,
            rating,
            comment,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('date_time', { ascending: false })

      if (bookingsError) throw bookingsError

      setHistory(bookings || [])
    } catch (error) {
      console.error('Error loading booking history:', error)
      toast.error('Failed to load booking history')
    } finally {
      setIsLoading(false)
    }
  }

  const filterHistory = () => {
    let filtered = history

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        getServiceName(booking.add_ons).toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location_address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.special_instructions?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredHistory(filtered)
  }

  const getServiceName = (addOns: any) => {
    if (addOns?.serviceType === 'cold_plunge') return 'Cold Plunge'
    if (addOns?.serviceType === 'infrared_sauna') return 'Infrared Sauna'
    if (addOns?.serviceType === 'combo_package') return 'Ultimate Recovery Combo'
    return 'Recovery Session'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Scheduled', variant: 'secondary' as const },
      confirmed: { label: 'Confirmed', variant: 'default' as const },
      in_progress: { label: 'In Progress', variant: 'default' as const },
      completed: { label: 'Completed', variant: 'secondary' as const },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const },
      no_show: { label: 'No Show', variant: 'destructive' as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  const getTotalPaid = (booking: BookingHistoryItem) => {
    if (!booking.order) return 0
    return booking.order.amount + booking.order.setup_fee_applied
  }

  const downloadReceipt = async (booking: BookingHistoryItem) => {
    if (!booking.order) {
      toast.error('No payment information available')
      return
    }

    try {
      // In a real app, this would generate and download a PDF receipt
      const receiptData = {
        booking_id: booking.id,
        order_id: booking.order.id,
        service: getServiceName(booking.add_ons),
        date: formatDateTime(booking.date_time).date,
        time: formatDateTime(booking.date_time).time,
        duration: booking.duration,
        amount: formatCurrency(booking.order.amount),
        setup_fee: formatCurrency(booking.order.setup_fee_applied),
        total: formatCurrency(getTotalPaid(booking)),
        address: booking.location_address
      }

      // Create and download a simple text receipt
      const receiptText = `
RECOVERY MACHINE - RECEIPT
========================

Booking ID: ${receiptData.booking_id}
Order ID: ${receiptData.order_id}

Service: ${receiptData.service}
Date: ${receiptData.date}
Time: ${receiptData.time}
Duration: ${receiptData.duration} minutes

Service Fee: ${receiptData.amount}
Setup Fee: ${receiptData.setup_fee}
Total Paid: ${receiptData.total}

Address: ${receiptData.address?.street}, ${receiptData.address?.city}, ${receiptData.address?.state} ${receiptData.address?.zipCode}

Thank you for choosing Recovery Machine!
      `.trim()

      const blob = new Blob([receiptText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recovery-machine-receipt-${booking.id}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Receipt downloaded successfully')
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
    }
  }

  const showReceiptDetails = (booking: BookingHistoryItem) => {
    setSelectedBooking(booking)
    setReceiptDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking History</h2>
        <p className="text-gray-600 mt-1">View your past recovery sessions and receipts</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((booking) => {
            const dateTime = formatDateTime(booking.date_time)
            const totalPaid = getTotalPaid(booking)

            return (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {getServiceName(booking.add_ons)}
                        </h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{dateTime.date} at {dateTime.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{booking.duration} minutes</span>
                        </div>
                        {booking.location_address?.city && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location_address.city}, {booking.location_address.state}</span>
                          </div>
                        )}
                      </div>

                      {booking.order && (
                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            Total Paid: {formatCurrency(totalPaid)}
                          </span>
                        </div>
                      )}

                      {booking.review && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>
                            You rated this session {booking.review.rating} stars
                          </span>
                        </div>
                      )}

                      {booking.special_instructions && (
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <strong>Instructions:</strong> {booking.special_instructions}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      {booking.order && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showReceiptDetails(booking)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Receipt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReceipt(booking)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <HistoryIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No matching bookings' : 'No booking history'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Your completed sessions will appear here'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Receipt Details Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              Payment information for your recovery session
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">RECOVERY MACHINE</h3>
                  <p className="text-sm text-gray-600">Receipt</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{getServiceName(selectedBooking.add_ons)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDateTime(selectedBooking.date_time).date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{formatDateTime(selectedBooking.date_time).time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedBooking.duration} minutes</span>
                  </div>
                  
                  {selectedBooking.order && (
                    <>
                      <hr className="my-3" />
                      <div className="flex justify-between">
                        <span>Service Fee:</span>
                        <span>{formatCurrency(selectedBooking.order.amount)}</span>
                      </div>
                      {selectedBooking.order.setup_fee_applied > 0 && (
                        <div className="flex justify-between">
                          <span>Setup Fee:</span>
                          <span>{formatCurrency(selectedBooking.order.setup_fee_applied)}</span>
                        </div>
                      )}
                      <hr className="my-3" />
                      <div className="flex justify-between font-bold">
                        <span>Total Paid:</span>
                        <span>{formatCurrency(getTotalPaid(selectedBooking))}</span>
                      </div>
                    </>
                  )}

                  <hr className="my-3" />
                  <div className="text-xs text-gray-500">
                    <p>Booking ID: {selectedBooking.id}</p>
                    {selectedBooking.order && (
                      <p>Order ID: {selectedBooking.order.id}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => selectedBooking && downloadReceipt(selectedBooking)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}