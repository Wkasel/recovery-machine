import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { CheckCircle, Calendar, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function StripeSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/book");
  }

  // Use regular client to check user auth status
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use service role client to fetch order/booking (bypasses RLS for guests)
  const serviceClient = createServiceRoleClient();

  // Get order details using the real FK relationship
  const { data: order, error: orderError } = await serviceClient
    .from("orders")
    .select(
      `
      *,
      bookings!orders_order_id_fkey (
        id,
        date_time,
        duration,
        location_address,
        special_instructions,
        status,
        add_ons,
        profiles:profiles!bookings_user_id_fkey (
          email,
          phone
        )
      )
    `
    )
    .eq("stripe_session_id", sessionId)
    .single();

  if (orderError || !order) {
    console.error("Order lookup error:", orderError);
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
            <CardDescription>
              We couldn't find your booking. Please contact support if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract booking from the FK relationship
  const booking = Array.isArray(order.bookings) ? order.bookings[0] : order.bookings;

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-xl text-muted-foreground">
          Your payment was successful and your booking is confirmed
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Confirmation #{order.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking && (
            <>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.date_time && formatDateTime(booking.date_time).date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.date_time && formatDateTime(booking.date_time).time}
                  </p>
                </div>
              </div>

              {booking.location_address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof booking.location_address === 'string'
                        ? booking.location_address
                        : `${booking.location_address.street}, ${booking.location_address.city}, ${booking.location_address.state} ${booking.location_address.zipCode}`}
                    </p>
                  </div>
                </div>
              )}

              {booking.profiles?.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{booking.profiles.email}</p>
                  </div>
                </div>
              )}

              {booking.profiles?.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{booking.profiles.phone}</p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(order.amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ You'll receive a confirmation email shortly</li>
            <li>✓ Our team will arrive 15 minutes before your session</li>
            <li>✓ Make sure the delivery area is accessible</li>
            <li>✓ Have towels and water ready for your session</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        {user && (
          <Button asChild className="flex-1">
            <Link href="/profile">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" className="flex-1">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
