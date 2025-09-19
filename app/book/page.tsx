'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookingStep, 
  BookingState, 
  ServiceType, 
  Address, 
  SetupFeeCalculation,
  BookingFormData 
} from '@/lib/types/booking'
import { BookingService } from '@/lib/services/booking-service'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { BookingStepper, MobileBookingStepper } from '@/components/booking/BookingStepper'
import { ServiceSelection } from '@/components/booking/ServiceSelection'
import { AddressForm } from '@/components/booking/AddressForm'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { PaymentStep } from '@/components/booking/PaymentStep'
import { ConfirmationStep } from '@/components/booking/ConfirmationStep'
import { ModuleErrorBoundary } from '@/components/error-boundary'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function BookingPage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  
  // Booking state management
  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [completedSteps, setCompletedSteps] = useState<BookingStep[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Booking data
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({
    addOns: {
      extraVisits: 0,
      familyMembers: 0,
      extendedTime: 0
    }
  })
  const [setupFee, setSetupFee] = useState<SetupFeeCalculation | null>(null)
  const [bookingId, setBookingId] = useState<string>('')
  const [totalPaid, setTotalPaid] = useState<number>(0)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        throw error
      }
      
      if (!user) {
        // Redirect to sign in with return URL
        router.push('/sign-in?redirect=/book')
        return
      }
      
      setUser(user)
    } catch (error) {
      console.error('Auth error:', error)
      setError('Authentication error. Please sign in to continue.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps: BookingStep[] = ['service', 'address', 'calendar', 'payment', 'confirmation']

  const getCurrentStepIndex = () => steps.indexOf(currentStep)

  const isStepCompleted = (step: BookingStep): boolean => {
    switch (step) {
      case 'service':
        return !!bookingData.serviceType
      case 'address':
        return !!bookingData.address && !!setupFee
      case 'calendar':
        return !!bookingData.dateTime
      case 'payment':
        return !!bookingId
      case 'confirmation':
        return true
      default:
        return false
    }
  }

  const canNavigateToStep = (step: BookingStep): boolean => {
    const stepIndex = steps.indexOf(step)
    const currentIndex = getCurrentStepIndex()
    
    // Can always go back to previous steps
    if (stepIndex < currentIndex) return true
    
    // Can go to next step if current step is completed
    if (stepIndex === currentIndex + 1) {
      return isStepCompleted(currentStep)
    }
    
    return false
  }

  const goToStep = (step: BookingStep) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step)
      updateCompletedSteps(step)
    }
  }

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setCurrentStep(nextStep)
      updateCompletedSteps(nextStep)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1]
      setCurrentStep(previousStep)
    }
  }

  const updateCompletedSteps = (upToStep: BookingStep) => {
    const stepIndex = steps.indexOf(upToStep)
    const completed = steps.slice(0, stepIndex).filter(step => isStepCompleted(step))
    setCompletedSteps(completed)
  }

  // Step handlers
  const handleServiceSelect = (serviceType: ServiceType) => {
    setBookingData(prev => ({ ...prev, serviceType }))
  }

  const handleAddressChange = (address: Address) => {
    setBookingData(prev => ({ ...prev, address }))
  }

  const handleSetupFeeCalculated = (setupFeeCalculation: SetupFeeCalculation) => {
    setSetupFee(setupFeeCalculation)
  }

  const handleDateTimeSelect = (dateTime: string) => {
    setBookingData(prev => ({ ...prev, dateTime }))
  }

  const handleAddOnsChange = (addOns: { extraVisits: number; familyMembers: number; extendedTime: number }) => {
    setBookingData(prev => ({ ...prev, addOns }))
  }

  const handleSpecialInstructionsChange = (instructions: string) => {
    setBookingData(prev => ({ ...prev, specialInstructions: instructions }))
  }

  const calculateTotalCost = () => {
    if (!bookingData.serviceType || !setupFee) return 0
    
    const service = { basePrice: 8000 } // Mock service price
    const addOnsCost = (bookingData.addOns?.familyMembers || 0) * 2500 + 
                      (bookingData.addOns?.extendedTime || 0) * 200 +
                      (bookingData.addOns?.extraVisits || 0) * service.basePrice * 0.8
    
    return service.basePrice + addOnsCost + setupFee.totalSetupFee
  }

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      if (!user || !bookingData.serviceType || !bookingData.dateTime || !bookingData.address) {
        throw new Error('Missing required booking information')
      }

      // Create booking in database
      const booking = await BookingService.createBooking({
        serviceType: bookingData.serviceType,
        dateTime: bookingData.dateTime,
        duration: 30, // Default duration
        address: bookingData.address,
        addOns: bookingData.addOns || { extraVisits: 0, familyMembers: 0, extendedTime: 0 },
        specialInstructions: bookingData.specialInstructions,
        termsAccepted: true
      }, user.id)

      if (!booking) {
        throw new Error('Failed to create booking')
      }

      setBookingId(booking.id)
      setTotalPaid(calculateTotalCost())
      goToNextStep()
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewBooking = () => {
    // Reset all booking data
    setBookingData({
      addOns: {
        extraVisits: 0,
        familyMembers: 0,
        extendedTime: 0
      }
    })
    setSetupFee(null)
    setBookingId('')
    setTotalPaid(0)
    setCurrentStep('service')
    setCompletedSteps([])
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking system...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ModuleErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                Welcome, {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Progress stepper */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop stepper */}
            <div className="hidden md:block">
              <BookingStepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={goToStep}
              />
            </div>
            
            {/* Mobile stepper */}
            <MobileBookingStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentStep === 'service' && (
            <ServiceSelection
              selectedService={bookingData.serviceType}
              onServiceSelect={handleServiceSelect}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 'address' && bookingData.serviceType && (
            <AddressForm
              address={bookingData.address}
              onAddressChange={handleAddressChange}
              onSetupFeeCalculated={handleSetupFeeCalculated}
              onNext={goToNextStep}
              onBack={goToPreviousStep}
            />
          )}

          {currentStep === 'calendar' && bookingData.serviceType && bookingData.address && (
            <BookingCalendar
              serviceType={bookingData.serviceType}
              selectedDateTime={bookingData.dateTime}
              onDateTimeSelect={handleDateTimeSelect}
              onAddOnsChange={handleAddOnsChange}
              onSpecialInstructionsChange={handleSpecialInstructionsChange}
              addOns={bookingData.addOns}
              specialInstructions={bookingData.specialInstructions}
              onNext={goToNextStep}
              onBack={goToPreviousStep}
            />
          )}

          {currentStep === 'payment' && 
           bookingData.serviceType && 
           bookingData.address && 
           bookingData.dateTime && 
           setupFee && (
            <PaymentStep
              serviceType={bookingData.serviceType}
              dateTime={bookingData.dateTime}
              address={bookingData.address}
              setupFee={setupFee}
              addOns={bookingData.addOns || { extraVisits: 0, familyMembers: 0, extendedTime: 0 }}
              specialInstructions={bookingData.specialInstructions}
              onPayment={handlePayment}
              onBack={goToPreviousStep}
            />
          )}

          {currentStep === 'confirmation' && 
           bookingId && 
           bookingData.serviceType && 
           bookingData.dateTime && 
           bookingData.address && (
            <ConfirmationStep
              bookingId={bookingId}
              serviceType={bookingData.serviceType}
              dateTime={bookingData.dateTime}
              address={bookingData.address}
              addOns={bookingData.addOns || { extraVisits: 0, familyMembers: 0, extendedTime: 0 }}
              specialInstructions={bookingData.specialInstructions}
              totalPaid={totalPaid}
              onNewBooking={handleNewBooking}
            />
          )}
        </div>
      </div>
    </ModuleErrorBoundary>
  )
}