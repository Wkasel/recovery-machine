// @ts-nocheck
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address, DatabaseBooking, services } from "@/lib/types/booking";
import { AlertCircle, Calendar, Check, Clock, Mail, MapPin, Phone, Plus, Share2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BookingConfirmationProps {
  booking: DatabaseBooking;
  orderAmount: number;
  setupFee: number;
  onNewBooking: () => void;
}

export function BookingConfirmation({
  booking,
  orderAmount,
  setupFee,
  onNewBooking,
}: BookingConfirmationProps) {
  const [showDetails, setShowDetails] = useState(false);

  const selectedService = services.find((s) => s.id === booking.add_ons?.serviceType);
  const addOns = booking.add_ons || {};

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

  const formatAddress = (addr: any) => {
    if (!addr) return "Address not available";
    
    // Handle different address formats
    if (typeof addr === 'string') return addr;
    
    // Handle object format
    const street = addr.street || addr.address || addr.line1 || '';
    const city = addr.city || '';
    const state = addr.state || addr.region || '';
    const zipCode = addr.zipCode || addr.zip || addr.postal_code || '';
    
    const parts = [street, city, `${state} ${zipCode}`.trim()].filter(Boolean);
    return parts.join(', ');
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const { date, time } = formatDateTime(booking.date_time);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Recovery Machine Booking Confirmed",
          text: `My recovery session is scheduled for ${date} at ${time}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Recovery Machine booking confirmed for ${date} at ${time}. Booking ID: ${booking.id}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-lg text-gray-600">
            Your recovery session has been successfully scheduled
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          Booking ID: {booking.id.slice(0, 8)}...
        </Badge>
      </div>

      {/* Booking details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Session Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-lg">{selectedService?.name}</p>
              <p className="text-gray-600">{selectedService?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{time}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">{booking.duration + (addOns.extendedTime || 0)} minutes</p>
            </div>

            {(addOns.familyMembers > 0 || addOns.extendedTime > 0 || addOns.extraVisits > 0) && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Add-ons</p>
                <div className="space-y-1 text-sm">
                  {addOns.familyMembers > 0 && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Family members: {addOns.familyMembers}</span>
                    </div>
                  )}
                  {addOns.extendedTime > 0 && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Extended time: +{addOns.extendedTime} minutes</span>
                    </div>
                  )}
                  {addOns.extraVisits > 0 && (
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-gray-400" />
                      <span>Extra visits: {addOns.extraVisits}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>Service Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-gray-600">{formatAddress(booking.address)}</p>
            </div>

            {booking.special_instructions && (
              <div>
                <p className="text-sm text-gray-600">Special Instructions</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.special_instructions}</p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Setup Time:</strong> Our team will arrive 30 minutes before your session to
                set up the equipment and ensure everything is perfect for your experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment summary */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Service ({selectedService?.name})</span>
                <span>{formatPrice(selectedService?.basePrice || 0)}</span>
              </div>

              {setupFee > 0 && (
                <div className="flex justify-between">
                  <span>Setup & Delivery Fee</span>
                  <span>{formatPrice(setupFee)}</span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span>{formatPrice(orderAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* What happens next */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Confirmation Email</p>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed confirmation email with all booking information
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">Pre-Session Call</p>
                <p className="text-sm text-gray-600">
                  Our team will call you 24 hours before to confirm details and answer questions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Equipment Setup</p>
                <p className="text-sm text-gray-600">
                  Professional setup 30 minutes before your session starts
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">4</span>
              </div>
              <div>
                <p className="font-medium">Enjoy Your Session</p>
                <p className="text-sm text-gray-600">
                  Professional guidance throughout your recovery experience
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important information */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your
          appointment. Please contact us at (555) 123-4567 if you need to reschedule.
        </AlertDescription>
      </Alert>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => setShowDetails(!showDetails)} variant="outline" className="flex-1">
          {showDetails ? "Hide" : "Show"} Payment Details
        </Button>

        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share Booking
        </Button>

        <Button onClick={onNewBooking} className="flex-1">
          Book Another Session
        </Button>
      </div>

      {/* Contact information */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>(555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>support@therecoverymachine.com</span>
          </div>
        </div>
        <p>
          Questions? Check our{" "}
          <Link href="/faq" className="text-blue-600 hover:underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
