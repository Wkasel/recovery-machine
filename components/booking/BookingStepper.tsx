"use client";

import type { BookingStep } from "@/lib/types/booking";
import { cn } from "@/lib/utils";
import { Calendar, Check, CheckCircle, CreditCard, MapPin } from "lucide-react";

interface BookingStepperProps {
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  onStepClick?: (step: BookingStep) => void;
}

const steps: Array<{
  id: BookingStep;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: "service",
    name: "Choose Service",
    icon: CheckCircle,
    description: "Select your recovery experience",
  },
  {
    id: "address",
    name: "Location",
    icon: MapPin,
    description: "Where should we set up?",
  },
  {
    id: "calendar",
    name: "Date & Time",
    icon: Calendar,
    description: "Pick your preferred slot",
  },
  {
    id: "payment",
    name: "Payment",
    icon: CreditCard,
    description: "Complete your booking",
  },
  {
    id: "confirmation",
    name: "Confirmation",
    icon: Check,
    description: "Booking confirmed!",
  },
];

export function BookingStepper({ currentStep, completedSteps, onStepClick }: BookingStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full py-6">
      <nav aria-label="Booking progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = isCompleted || index <= currentStepIndex;

            return (
              <li key={step.id} className="flex flex-col items-center flex-1">
                {/* Step indicator */}
                <div className="flex items-center w-full">
                  {/* Connector line (left) */}
                  {index > 0 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2",
                        isCompleted || index <= currentStepIndex ? "bg-mint" : "bg-border"
                      )}
                    />
                  )}

                  {/* Step circle */}
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick?.(step.id)}
                    disabled={!isClickable}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      isCompleted
                        ? "bg-mint border-mint text-charcoal"
                        : isCurrent
                          ? "border-mint bg-mint text-charcoal ring-4 ring-mint/20"
                          : "border-border bg-background text-muted-foreground",
                      isClickable && !isCompleted && !isCurrent
                        ? "hover:border-mint hover:bg-mint/10 cursor-pointer"
                        : !isClickable
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </button>

                  {/* Connector line (right) */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2",
                        isCompleted || index < currentStepIndex ? "bg-mint" : "bg-border"
                      )}
                    />
                  )}
                </div>

                {/* Step label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-light">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export function MobileBookingStepper({ currentStep, completedSteps }: BookingStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  return (
    <div className="md:hidden bg-white/70 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2",
              "border-mint bg-mint text-charcoal shadow-sm"
            )}
          >
            <currentStepData.icon className="w-4 h-4" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">{currentStepData.name}</p>
            <p className="text-xs text-muted-foreground font-light">{currentStepData.description}</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground font-medium">
          {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full bg-muted rounded-full h-2">
        <div
          className="bg-mint h-2 rounded-full transition-all duration-300 shadow-sm"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
