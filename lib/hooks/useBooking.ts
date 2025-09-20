"use client";

import { BookingService } from "@/lib/services/booking-service";
import { Address, BookingStep, ServiceType, SetupFeeCalculation } from "@/lib/types/booking";
import { BookingUtils } from "@/lib/utils/booking-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseBookingState {
  // Current state
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  isLoading: boolean;
  error: string | null;
  user: any;

  // Booking data
  serviceType?: ServiceType;
  address?: Address;
  dateTime?: string;
  setupFee?: SetupFeeCalculation;
  addOns: { extraVisits: number; familyMembers: number; extendedTime: number };
  specialInstructions?: string;

  // Calculated values
  totalCost: number;
  isValid: boolean;

  // Actions
  setServiceType: (type: ServiceType) => void;
  setAddress: (address: Address) => void;
  setDateTime: (dateTime: string) => void;
  setSetupFee: (fee: SetupFeeCalculation) => void;
  setAddOns: (addOns: { extraVisits: number; familyMembers: number; extendedTime: number }) => void;
  setSpecialInstructions: (instructions: string) => void;
  goToStep: (step: BookingStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  submitBooking: () => Promise<string | null>;
  resetBooking: () => void;
}

export function useBooking(): UseBookingState {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  // State management
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [completedSteps, setCompletedSteps] = useState<BookingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Booking data
  const [serviceType, setServiceTypeState] = useState<ServiceType>();
  const [address, setAddressState] = useState<Address>();
  const [dateTime, setDateTimeState] = useState<string>();
  const [setupFee, setSetupFeeState] = useState<SetupFeeCalculation>();
  const [addOns, setAddOnsState] = useState({ extraVisits: 0, familyMembers: 0, extendedTime: 0 });
  const [specialInstructions, setSpecialInstructionsState] = useState<string>();

  const steps: BookingStep[] = ["service", "address", "calendar", "payment", "confirmation"];

  // Initialize authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      if (!user) {
        router.push("/sign-in?redirect=/book");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error("Auth error:", error);
      setError("Authentication error. Please sign in to continue.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step validation
  const isStepCompleted = (step: BookingStep): boolean => {
    switch (step) {
      case "service":
        return !!serviceType;
      case "address":
        return !!address && !!setupFee;
      case "calendar":
        return !!dateTime;
      case "payment":
        return false; // Completed after payment
      case "confirmation":
        return true;
      default:
        return false;
    }
  };

  // Navigation
  const canNavigateToStep = (step: BookingStep): boolean => {
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);

    if (stepIndex < currentIndex) return true;
    if (stepIndex === currentIndex + 1) return isStepCompleted(currentStep);

    return false;
  };

  const goToStep = (step: BookingStep) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
      updateCompletedSteps(step);
    }
  };

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      updateCompletedSteps(nextStep);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      setCurrentStep(previousStep);
    }
  };

  const updateCompletedSteps = (upToStep: BookingStep) => {
    const stepIndex = steps.indexOf(upToStep);
    const completed = steps.slice(0, stepIndex).filter((step) => isStepCompleted(step));
    setCompletedSteps(completed);
  };

  // Data setters
  const setServiceType = (type: ServiceType) => {
    setServiceTypeState(type);
    setError(null);
  };

  const setAddress = (newAddress: Address) => {
    setAddressState(newAddress);
    setError(null);
  };

  const setDateTime = (newDateTime: string) => {
    // Validate booking time
    if (!BookingUtils.isValidBookingTime(newDateTime)) {
      setError("Booking must be at least 2 hours in advance");
      return;
    }

    if (!BookingUtils.isWithinBusinessHours(newDateTime)) {
      setError("Please select a time between 8 AM and 8 PM");
      return;
    }

    setDateTimeState(newDateTime);
    setError(null);
  };

  const setSetupFee = (fee: SetupFeeCalculation) => {
    setSetupFeeState(fee);
    setError(null);
  };

  const setAddOns = (newAddOns: {
    extraVisits: number;
    familyMembers: number;
    extendedTime: number;
  }) => {
    setAddOnsState(newAddOns);
  };

  const setSpecialInstructions = (instructions: string) => {
    setSpecialInstructionsState(instructions);
  };

  // Calculate total cost
  const calculateTotalCost = (): number => {
    if (!serviceType || !setupFee) return 0;

    const service = BookingUtils.getService(serviceType);
    if (!service) return 0;

    const addOnsCost = BookingUtils.calculateAddOnCost(addOns, service.basePrice);
    return service.basePrice + addOnsCost + setupFee.totalSetupFee;
  };

  const totalCost = calculateTotalCost();

  // Validate complete booking
  const validateBooking = (): { isValid: boolean; missingFields: string[] } => {
    return BookingUtils.validateBookingData({
      serviceType,
      dateTime,
      address,
      setupFee,
    });
  };

  const { isValid } = validateBooking();

  // Submit booking
  const submitBooking = async (): Promise<string | null> => {
    if (!user || !isValid) {
      setError("Please complete all required fields");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check for conflicts
      const hasConflicts = await BookingService.checkConflicts(
        dateTime!,
        BookingUtils.getService(serviceType!)?.duration || 30,
        user.id
      );

      if (hasConflicts) {
        throw new Error("This time slot is no longer available. Please choose a different time.");
      }

      // Create booking
      const booking = await BookingService.createBooking(
        {
          serviceType: serviceType!,
          dateTime: dateTime!,
          duration: BookingUtils.calculateTotalDuration(
            BookingUtils.getService(serviceType!)?.duration || 30,
            addOns.extendedTime
          ),
          address: address!,
          addOns,
          specialInstructions,
          termsAccepted: true,
        },
        user.id
      );

      if (!booking) {
        throw new Error("Failed to create booking");
      }

      // Move to confirmation step
      setCurrentStep("confirmation");

      return booking.id;
    } catch (error) {
      console.error("Booking submission error:", error);
      setError(error instanceof Error ? error.message : "Failed to create booking");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset booking
  const resetBooking = () => {
    setServiceTypeState(undefined);
    setAddressState(undefined);
    setDateTimeState(undefined);
    setSetupFeeState(undefined);
    setAddOnsState({ extraVisits: 0, familyMembers: 0, extendedTime: 0 });
    setSpecialInstructionsState(undefined);
    setCurrentStep("service");
    setCompletedSteps([]);
    setError(null);
  };

  return {
    // State
    currentStep,
    completedSteps,
    isLoading,
    error,
    user,

    // Data
    serviceType,
    address,
    dateTime,
    setupFee,
    addOns,
    specialInstructions,

    // Calculated
    totalCost,
    isValid,

    // Actions
    setServiceType,
    setAddress,
    setDateTime,
    setSetupFee,
    setAddOns,
    setSpecialInstructions,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    submitBooking,
    resetBooking,
  };
}
