"use client";

import { AddressForm } from "@/components/booking/AddressForm";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingStepper, MobileBookingStepper } from "@/components/booking/BookingStepper";
import { PaymentStep } from "@/components/booking/PaymentStep";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
import { BoltCheckout } from "@/components/payments/BoltCheckout";
import { Button } from "@/components/ui/button";
import { createBookingWithPayment } from "@/core/actions/booking";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Address,
  BookingState,
  BookingStep,
  DatabaseBooking,
  services,
  ServiceType,
  SetupFeeCalculation,
} from "@/lib/types/booking";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingPage(): React.ReactElement {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [completedSteps, setCompletedSteps] = useState<BookingStep[]>([]);
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: "service",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [finalBooking, setFinalBooking] = useState<DatabaseBooking | null>(null);
  const [orderAmount, setOrderAmount] = useState(0);
  const [showBoltCheckout, setShowBoltCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleStepClick = (step: BookingStep) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
      setBookingState((prev) => ({ ...prev, currentStep: step }));
      // Scroll to top on mobile when changing steps
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const markStepCompleted = (step: BookingStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
  };

  const moveToStep = (step: BookingStep) => {
    setCurrentStep(step);
    setBookingState((prev) => ({ ...prev, currentStep: step }));
    // Scroll to top on mobile when moving between steps
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleServiceSelect = (serviceType: ServiceType) => {
    setBookingState((prev) => ({ ...prev, serviceType }));
  };

  const handleServiceNext = () => {
    if (bookingState.serviceType) {
      markStepCompleted("service");
      moveToStep("address");
    }
  };

  const handleAddressChange = (address: Address) => {
    setBookingState((prev) => ({ ...prev, address }));
  };

  const handleSetupFeeCalculated = (setupFee: SetupFeeCalculation) => {
    setBookingState((prev) => ({ ...prev, setupFee }));
  };

  const handleAddressNext = () => {
    if (bookingState.address && bookingState.setupFee) {
      markStepCompleted("address");
      moveToStep("calendar");
    }
  };

  const handleDateTimeSelect = (dateTime: string) => {
    setBookingState((prev) => ({ ...prev, dateTime }));
  };

  const handleAddOnsChange = (addOns: {
    extraVisits: number;
    familyMembers: number;
    extendedTime: number;
  }) => {
    setBookingState((prev) => ({ ...prev, addOns }));
  };

  const handleSpecialInstructionsChange = (instructions: string) => {
    setBookingState((prev) => ({ ...prev, specialInstructions: instructions }));
  };

  const handleCalendarNext = () => {
    if (bookingState.dateTime) {
      markStepCompleted("calendar");
      moveToStep("payment");
    }
  };

  const calculateTotalAmount = () => {
    const selectedService = services.find((s) => s.id === bookingState.serviceType);
    const basePrice = selectedService?.basePrice || 0;
    const setupFee = bookingState.setupFee?.totalSetupFee || 0;

    // Calculate add-ons
    const addOns = bookingState.addOns || { extraVisits: 0, familyMembers: 0, extendedTime: 0 };
    const familyMemberCost = addOns.familyMembers * 2500;
    const extendedTimeCost = addOns.extendedTime * 200;
    const extraVisitCost = addOns.extraVisits * basePrice * 0.8;

    const addOnsCost = familyMemberCost + extendedTimeCost + extraVisitCost;

    return basePrice + setupFee + addOnsCost;
  };

  const handlePayment = async (guestData?: { email: string; phone: string }) => {
    if (!bookingState.serviceType || !bookingState.dateTime || !bookingState.address) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before payment.",
        variant: "destructive",
      });
      return;
    }

    // No auth check - allow guest bookings
    // Email will be collected in payment step for auto-account creation

    setIsLoading(true);

    try {
      const selectedService = services.find((s) => s.id === bookingState.serviceType);
      const amount = calculateTotalAmount();
      setOrderAmount(amount);

      const bookingData = {
        serviceType: bookingState.serviceType,
        dateTime: bookingState.dateTime,
        duration: selectedService?.duration || 30,
        address: bookingState.address,
        addOns: bookingState.addOns || { extraVisits: 0, familyMembers: 0, extendedTime: 0 },
        specialInstructions: bookingState.specialInstructions,
        amount,
        setupFee: bookingState.setupFee?.totalSetupFee || 0,
        orderType: "one_time" as const,
        termsAccepted: true,
        // Include guest booking info if no user
        guestBooking: !user,
        userEmail: user?.email || null,
        guestEmail: guestData?.email || null,
        guestPhone: guestData?.phone || null,
      };

      // Call our bookings API to create the booking and order
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Booking Confirmed!",
          description: "Redirecting to your confirmation page...",
        });

        // Redirect to public confirmation page with token
        if (result.confirmationUrl) {
          window.location.href = result.confirmationUrl;
        } else {
          // Fallback to old confirmation step if no URL
          const confirmedBooking: DatabaseBooking = {
            id: result.booking.id,
            user_id: result.booking.user_id,
            order_id: result.booking.order_id,
            date_time: result.booking.date_time,
            duration: result.booking.duration,
            add_ons: result.booking.add_ons,
            status: result.booking.status,
            location_address: result.booking.address || result.booking.location_address,
            special_instructions: result.booking.notes || result.booking.special_instructions,
            created_at: result.booking.created_at,
            updated_at: result.booking.updated_at,
          };

          setFinalBooking(confirmedBooking);
          markStepCompleted("payment");
          moveToStep("confirmation");
        }
      } else {
        throw new Error(result.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    setShowBoltCheckout(false);
    markStepCompleted("payment");
    moveToStep("confirmation");

    // You would typically fetch the updated booking here
    // For now, we'll create a mock booking for the confirmation
    const mockBooking: DatabaseBooking = {
      id: paymentResult.transaction_id || "booking_123",
      user_id: user?.id || "temp-user-id",
      order_id: checkoutData?.metadata?.orderId || "order_123",
      date_time: bookingState.dateTime!,
      duration: services.find((s) => s.id === bookingState.serviceType)?.duration || 30,
      add_ons: {
        serviceType: bookingState.serviceType,
        ...bookingState.addOns,
      },
      status: "confirmed",
      location_address: bookingState.address!,
      special_instructions: bookingState.specialInstructions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFinalBooking(mockBooking);

    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed.",
    });
  };

  const handlePaymentError = (error: any) => {
    setShowBoltCheckout(false);
    toast({
      title: "Payment Failed",
      description: error.message || "Payment could not be processed.",
      variant: "destructive",
    });
  };

  const handleNewBooking = () => {
    setCurrentStep("service");
    setCompletedSteps([]);
    setBookingState({ currentStep: "service" });
    setFinalBooking(null);
    setShowBoltCheckout(false);
    setCheckoutData(null);
  };

  if (showBoltCheckout && checkoutData) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground">Secure payment processing for your recovery session</p>
          </div>

          <BoltCheckout
            {...checkoutData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={() => setShowBoltCheckout(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book Your Recovery Session</h1>
          <p className="text-muted-foreground">
            Professional cold plunge & infrared sauna delivered to your door
          </p>
        </div>

        {/* Progress indicator */}
        <div className="hidden md:block mb-8">
          <BookingStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>
        <div className="md:hidden mb-6">
          <MobileBookingStepper currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        {/* Step content */}
        <div className="bg-black border border-neutral-800 p-6 md:p-8">
          {isLoading && (
            <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing...</span>
              </div>
            </div>
          )}

          {currentStep === "service" && (
            <ServiceSelection
              selectedService={bookingState.serviceType}
              onServiceSelect={handleServiceSelect}
              onNext={handleServiceNext}
            />
          )}

          {currentStep === "address" && (
            <AddressForm
              address={bookingState.address}
              onAddressChange={handleAddressChange}
              onSetupFeeCalculated={handleSetupFeeCalculated}
              onNext={handleAddressNext}
              onBack={() => moveToStep("service")}
            />
          )}

          {currentStep === "calendar" && bookingState.serviceType && (
            <BookingCalendar
              serviceType={bookingState.serviceType}
              selectedDateTime={bookingState.dateTime}
              onDateTimeSelect={handleDateTimeSelect}
              onAddOnsChange={handleAddOnsChange}
              onSpecialInstructionsChange={handleSpecialInstructionsChange}
              addOns={bookingState.addOns}
              specialInstructions={bookingState.specialInstructions}
              onNext={handleCalendarNext}
              onBack={() => moveToStep("address")}
            />
          )}

          {currentStep === "payment" &&
            bookingState.serviceType &&
            bookingState.dateTime &&
            bookingState.address &&
            bookingState.setupFee && (
              <PaymentStep
                serviceType={bookingState.serviceType}
                dateTime={bookingState.dateTime}
                address={bookingState.address}
                setupFee={bookingState.setupFee}
                addOns={
                  bookingState.addOns || { extraVisits: 0, familyMembers: 0, extendedTime: 0 }
                }
                specialInstructions={bookingState.specialInstructions}
                onPayment={handlePayment}
                onBack={() => moveToStep("calendar")}
                user={user} // Pass user to show email field for guests
              />
            )}

          {currentStep === "confirmation" && finalBooking && (
            <BookingConfirmation
              booking={finalBooking}
              orderAmount={orderAmount}
              setupFee={bookingState.setupFee?.totalSetupFee || 0}
              onNewBooking={handleNewBooking}
            />
          )}
        </div>
      </div>
    </div>
  );
}
