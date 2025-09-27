"use client";

import { AddressForm } from "@/components/booking/AddressForm";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingStepper, MobileBookingStepper } from "@/components/booking/BookingStepper";
import { PaymentStep } from "@/components/booking/PaymentStep";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
import { BoltCheckout } from "@/components/payments/BoltCheckout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Stack, Flex } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/typography/Typography";
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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BookingPageProps {
  // No props needed for this example
}

export default function BookingPageRefactored(): React.ReactElement {
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

  // Enhanced loading state with skeleton
  if (!mounted || authLoading) {
    return (
      <Container size="lg" className="min-h-screen">
        <Stack spacing="xl" className="py-12">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          {/* Skeleton for stepper */}
          <div className="hidden md:block">
            <Flex justify="center" gap="lg" className="mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Flex key={i} align="center" gap="sm">
                  <Skeleton shape="circle" className="h-8 w-8" />
                  <Skeleton className="h-4 w-16" />
                </Flex>
              ))}
            </Flex>
          </div>
          
          {/* Skeleton for main content */}
          <Card size="lg">
            <Stack spacing="lg">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>
    );
  }

  const handleStepClick = (step: BookingStep) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
      setBookingState((prev) => ({ ...prev, currentStep: step }));
      // Smooth scroll with better UX
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Focus management for accessibility
        const stepContent = document.querySelector(`[data-step="${step}"]`);
        if (stepContent) {
          (stepContent as HTMLElement).focus();
        }
      }, 100);
    }
  };

  const markStepCompleted = (step: BookingStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
      // Success feedback
      toast({
        title: `${step.charAt(0).toUpperCase() + step.slice(1)} completed`,
        description: "Moving to next step...",
        duration: 2000,
      });
    }
  };

  const moveToStep = (step: BookingStep) => {
    setCurrentStep(step);
    setBookingState((prev) => ({ ...prev, currentStep: step }));
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
        guestBooking: !user,
        userEmail: user?.email || null,
        guestEmail: guestData?.email || null,
        guestPhone: guestData?.phone || null,
      };

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

        if (result.confirmationUrl) {
          window.location.href = result.confirmationUrl;
        } else {
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
      <Container size="md" className="min-h-screen">
        <Stack spacing="xl" className="py-12">
          <div className="text-center">
            <Heading size="display-sm" weight="bold">
              Complete Your Payment
            </Heading>
            <Text variant="large" color="muted" className="mt-4">
              Secure payment processing for your recovery session
            </Text>
          </div>

          <BoltCheckout
            {...checkoutData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={() => setShowBoltCheckout(false)}
          />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" className="min-h-screen">
      <Stack spacing="xl" className="py-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <Heading size="display-sm" weight="bold" className="mb-4">
            Book Your Recovery Session
          </Heading>
          <Text variant="large" color="muted">
            Professional cold plunge & infrared sauna delivered to your door
          </Text>
        </div>

        {/* Progress Indicators */}
        <div className="hidden md:block">
          <BookingStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>
        <div className="md:hidden">
          <MobileBookingStepper currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        {/* Main Content Area */}
        <Card 
          variant="elevated" 
          size="lg" 
          className="relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <Flex align="center" gap="md" className="bg-card p-6 rounded-lg border shadow-lg">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <Stack spacing="xs">
                  <Text weight="medium">Processing your booking...</Text>
                  <Text size="sm" color="muted">Please don't close this page</Text>
                </Stack>
              </Flex>
            </div>
          )}

          {/* Step Content */}
          <div 
            data-step={currentStep}
            tabIndex={-1}
            className="focus:outline-none"
            role="main"
            aria-label={`Booking step: ${currentStep}`}
          >
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
                  user={user}
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
        </Card>
      </Stack>
    </Container>
  );
}