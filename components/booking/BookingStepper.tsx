'use client'

import { useState, useEffect } from 'react'
import { BookingStep, BookingState, ServiceType } from '@/lib/types/booking'
import { cn } from '@/lib/utils'
import { Check, MapPin, Calendar, CreditCard, CheckCircle } from 'lucide-react'

interface BookingStepperProps {
  currentStep: BookingStep
  completedSteps: BookingStep[]
  onStepClick?: (step: BookingStep) => void
}

const steps: Array<{
  id: BookingStep
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = [
  {
    id: 'service',
    name: 'Choose Service',
    icon: CheckCircle,
    description: 'Select your recovery experience'
  },
  {
    id: 'address',
    name: 'Location',
    icon: MapPin,
    description: 'Where should we set up?'
  },
  {
    id: 'calendar',
    name: 'Date & Time',
    icon: Calendar,
    description: 'Pick your preferred slot'
  },
  {
    id: 'payment',
    name: 'Payment',
    icon: CreditCard,
    description: 'Complete your booking'
  },
  {
    id: 'confirmation',
    name: 'Confirmation',
    icon: Check,
    description: 'Booking confirmed!'
  }
]

export function BookingStepper({ currentStep, completedSteps, onStepClick }: BookingStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  
  return (
    <div className="w-full py-6">
      <nav aria-label="Booking progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = step.id === currentStep
            const isClickable = isCompleted || index <= currentStepIndex
            
            return (
              <li key={step.id} className="flex flex-col items-center flex-1">
                {/* Step indicator */}
                <div className="flex items-center w-full">
                  {/* Connector line (left) */}
                  {index > 0 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2',
                        isCompleted || (index <= currentStepIndex)
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      )}
                    />
                  )}
                  
                  {/* Step circle */}
                  <button
                    onClick={() => isClickable && onStepClick?.(step.id)}
                    disabled={!isClickable}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                      isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isCurrent
                        ? 'border-blue-600 bg-white text-blue-600 ring-4 ring-blue-100'
                        : 'border-gray-300 bg-white text-gray-400',
                      isClickable && !isCompleted && !isCurrent
                        ? 'hover:border-blue-400 hover:text-blue-400 cursor-pointer'
                        : !isClickable
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
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
                        'flex-1 h-0.5 mx-2',
                        isCompleted || (index < currentStepIndex)
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export function MobileBookingStepper({ currentStep, completedSteps }: BookingStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const currentStepData = steps[currentStepIndex]
  
  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full border-2',
              'border-blue-600 bg-blue-600 text-white'
            )}
          >
            <currentStepData.icon className="w-4 h-4" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {currentStepData.name}
            </p>
            <p className="text-xs text-gray-500">
              {currentStepData.description}
            </p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {currentStepIndex + 1} of {steps.length}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}