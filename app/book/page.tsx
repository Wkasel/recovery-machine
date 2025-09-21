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
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleStepClick = (step: BookingStep) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
      setBookingState((prev) => ({ ...prev, currentStep: step }));
      // Scroll to top on mobile when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handlePayment = async () => {
    if (!bookingState.serviceType || !bookingState.dateTime || !bookingState.address) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before payment.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      router.push("/auth/login?redirect=/book");
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
      };

      const result = await createBookingWithPayment(bookingData);

      if (result.success) {
        // Set up Bolt checkout
        setCheckoutData({
          amount,
          orderType: "one_time",
          description: `Recovery Machine - ${selectedService?.name} session`,
          customerEmail: user.email!,
          metadata: {
            bookingId: (result as any).booking?.id || "temp-booking-id",
            orderId: (result as any).orderId || "temp-order-id",
          },
        });
        setShowBoltCheckout(true);
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
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
            <p className="text-neutral-400">Secure payment processing for your recovery session</p>
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
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Book Your Recovery Session</h1>
          <p className="text-neutral-400">
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
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
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
            bookingState.setupFee &&
            (!user ? (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Sign In to Complete Booking
                </h2>
                <p className="text-neutral-400 mb-6">
                  Please sign in or create an account to complete your booking and payment.
                </p>
                <div className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/auth/login?redirect=/book">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/auth/register?redirect=/book">Create Account</Link>
                  </Button>
                </div>
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => moveToStep("calendar")} size="lg">
                    Back to Calendar
                  </Button>
                </div>
              </div>
            ) : (
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
              />
            ))}

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
