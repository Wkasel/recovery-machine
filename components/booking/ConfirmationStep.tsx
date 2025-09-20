"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Address, ServiceType, services } from "@/lib/types/booking";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmationStepProps {
  bookingId: string;
  serviceType: ServiceType;
  dateTime: string;
  address: Address;
  addOns: { extraVisits: number; familyMembers: number; extendedTime: number };
  specialInstructions?: string;
  totalPaid: number;
  onNewBooking: () => void;
}

export function ConfirmationStep({
  bookingId,
  serviceType,
  dateTime,
  address,
  addOns,
  specialInstructions,
  totalPaid,
  onNewBooking,
}: ConfirmationStepProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const selectedService = services.find((s) => s.id === serviceType);

  useEffect(() => {
    // Simulate email confirmation
    const timer = setTimeout(() => {
      setEmailSent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
      iso: date.toISOString(),
    };
  };

  const formatAddress = (addr: Address) => {
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const generateCalendarEvent = () => {
    const { date, time, iso } = formatDateTime(dateTime);
    const startDate = new Date(iso);
    const endDate = new Date(
      startDate.getTime() + ((selectedService?.duration || 30) + (addOns.extendedTime || 0)) * 60000
    );

    const calendarUrl = new URL("https://calendar.google.com/calendar/render");
    calendarUrl.searchParams.set("action", "TEMPLATE");
    calendarUrl.searchParams.set("text", `Recovery Machine - ${selectedService?.name}`);
    calendarUrl.searchParams.set(
      "dates",
      `${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`
    );
    calendarUrl.searchParams.set("location", formatAddress(address));
    calendarUrl.searchParams.set(
      "details",
      `Your ${selectedService?.name} session with Recovery Machine.\n\nBooking ID: ${bookingId}\n\nSpecial Instructions: ${specialInstructions || "None"}\n\nQuestions? Call us at (555) 123-4567`
    );

    return calendarUrl.toString();
  };

  const shareBooking = async () => {
    const shareData = {
      title: "Recovery Machine Booking Confirmed",
      text: `I just booked a ${selectedService?.name} session with Recovery Machine for ${formatDateTime(dateTime).date}!`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Booking details copied to clipboard!");
    }
  };

  const { date, time } = formatDateTime(dateTime);

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">We're excited to bring the recovery experience to you</p>
        <Badge className="mt-2 bg-green-100 text-green-800">Booking ID: {bookingId}</Badge>
      </div>

      {/* Booking details card */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Your Recovery Session</span>
          </CardTitle>
          <CardDescription>Everything is set up for your appointment</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Service details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Service</p>
                  <p className="text-gray-600">{selectedService?.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedService?.duration || 0) + (addOns.extendedTime || 0)} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Date & Time</p>
                  <p className="text-gray-600">{date}</p>
                  <p className="text-sm text-gray-500">{time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{formatAddress(address)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {(addOns.familyMembers > 0 || addOns.extendedTime > 0 || addOns.extraVisits > 0) && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add-ons</p>
                    <div className="text-gray-600 space-y-1">
                      {addOns.familyMembers > 0 && (
                        <p className="text-sm">Family members: {addOns.familyMembers}</p>
                      )}
                      {addOns.extendedTime > 0 && (
                        <p className="text-sm">Extended time: +{addOns.extendedTime} min</p>
                      )}
                      {addOns.extraVisits > 0 && (
                        <p className="text-sm">Extra visits: {addOns.extraVisits}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Paid</p>
                  <p className="text-gray-600">{formatPrice(totalPaid)}</p>
                  <p className="text-sm text-gray-500">Payment confirmed</p>
                </div>
              </div>

              {specialInstructions && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Special Instructions</p>
                    <p className="text-sm text-gray-600">{specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What happens next */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Equipment Delivery (2 hours before)</p>
                <p className="text-sm text-gray-600">
                  Our team will arrive 2 hours before your session to set up the equipment
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Pre-Session Call (1 hour before)</p>
                <p className="text-sm text-gray-600">
                  We'll call to confirm everything is ready and answer any last-minute questions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Your Recovery Session</p>
                <p className="text-sm text-gray-600">
                  Enjoy your {selectedService?.name} experience with professional guidance
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <p className="font-medium">Equipment Pickup</p>
                <p className="text-sm text-gray-600">
                  Our team will return to collect the equipment after your session
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            window.open(generateCalendarEvent(), "_blank");
            setCalendarAdded(true);
          }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {calendarAdded ? "Added to Calendar" : "Add to Calendar"}
        </Button>

        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>

        <Button variant="outline" className="w-full" onClick={shareBooking}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        <Button className="w-full" onClick={onNewBooking}>
          Book Another Session
        </Button>
      </div>

      {/* Email confirmation status */}
      <Alert className={emailSent ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          {emailSent ? (
            <span className="text-green-800">
              ✓ Confirmation email sent! Check your inbox for detailed booking information.
            </span>
          ) : (
            <span className="text-blue-800">📧 Sending confirmation email...</span>
          )}
        </AlertDescription>
      </Alert>

      {/* Contact information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">support@recoverymachine.com</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Available 24/7 for any questions or changes to your booking
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rating prompt */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-semibold text-amber-900 mb-2">Love Recovery Machine?</h3>
            <p className="text-sm text-amber-700 mb-4">
              Help others discover the benefits of recovery therapy by leaving us a review!
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Leave a Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
