// @ts-nocheck
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address, ServiceType, SetupFeeCalculation, services } from "@/lib/types/booking";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { 
  validateDevPromoCode, 
  isDevelopmentEnvironment,
  getAvailableDevPromoCodes 
} from "@/lib/payment/dev-bypass";
import {
  AlertCircle,
  Calendar,
  Check,
  CreditCard,
  DollarSign,
  Loader2,
  Lock,
  MapPin,
  Users,
  Code,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentStepProps {
  serviceType: ServiceType;
  dateTime: string;
  address: Address;
  setupFee: SetupFeeCalculation;
  addOns: { extraVisits: number; familyMembers: number; extendedTime: number };
  specialInstructions?: string;
  onPayment: (
    guestData?: { email: string; phone: string },
    options?: { devBypass?: boolean }
  ) => Promise<void> | void;
  onBack: () => void;
  user?: User | null;
}

export function PaymentStep({
  serviceType,
  dateTime,
  address,
  setupFee,
  addOns,
  specialInstructions,
  onPayment,
  onBack,
  user,
}: PaymentStepProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [shouldBypassPayment, setShouldBypassPayment] = useState(false);

  // Guest booking fields
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const isGuestBooking = !user;
  const [paymentMethod, setPaymentMethod] = useState<"card" | "subscription">("card");
  
  const isDevMode = isDevelopmentEnvironment();
  const availableDevCodes = getAvailableDevPromoCodes();

  const selectedService = services.find((s) => s.id === serviceType);

  const calculateAddOnCost = () => {
    const familyMemberCost = addOns.familyMembers * 2500; // $25 per family member
    const extendedTimeCost = addOns.extendedTime * 200; // $2 per minute
    const extraVisitCost = addOns.extraVisits * (selectedService?.basePrice || 0) * 0.8; // 20% discount

    return familyMemberCost + extendedTimeCost + extraVisitCost;
  };

  const calculateSubtotal = () => {
    return (selectedService?.basePrice || 0) + calculateAddOnCost();
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const setupFeeAmount = setupFee.totalSetupFee;
    const discount = promoDiscount;

    return Math.max(0, subtotal + setupFeeAmount - discount);
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

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

  const formatAddress = (addr: Address) => {
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  const handlePromoCodeApply = () => {
    const code = promoCode.toUpperCase().trim();
    
    // Check dev bypass codes first (if in dev mode)
    if (isDevMode) {
      const devResult = validateDevPromoCode(code);
      if (devResult.isValid) {
        setPromoDiscount(devResult.discount === 100 ? calculateTotal() : devResult.discount * 100);
        setShouldBypassPayment(devResult.shouldBypassPayment);
        setPromoApplied(true);
        toast.success(`Dev code applied: ${devResult.description}`);
        return;
      }
    }
    
    // Regular promo codes
    const validPromoCodes: Record<string, number> = {
      FIRST20: 2000, // $20 off
      RECOVERY10: 1000, // $10 off
      NEWUSER: 1500, // $15 off
    };

    const discount = validPromoCodes[code] || 0;
    if (discount > 0) {
      setPromoDiscount(discount);
      setPromoApplied(true);
      setShouldBypassPayment(false);
      toast.success(`Promo code applied! You saved ${formatPrice(discount)}`);
    } else {
      toast.error("Invalid promo code");
      setPromoDiscount(0);
      setPromoApplied(false);
      setShouldBypassPayment(false);
    }
  };

  const handlePayment = async () => {
    // Validate guest fields for non-authenticated users
    if (isGuestBooking) {
      if (!guestEmail || !guestPhone) {
        toast.error("Please enter your email and phone number to continue.");
        return;
      }
      
      // Basic email validation
      if (!guestEmail.includes("@")) {
        toast.error("Please enter a valid email address.");
        return;
      }
      
      // Basic phone validation (at least 10 digits)
      const phoneDigits = guestPhone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        toast.error("Please enter a valid phone number.");
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      await onPayment(
        isGuestBooking ? { email: guestEmail, phone: guestPhone } : undefined,
        { devBypass: shouldBypassPayment && isDevMode }
      );
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const { date, time } = formatDateTime(dateTime);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Complete Your Booking</h2>
        <p className="text-muted-foreground font-light">Review your details and complete payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-6">
        {/* Booking Summary */}
        <div className="space-y-4">
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground font-serif">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service */}
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedService?.duration + (addOns.extendedTime || 0)} minutes
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">{date}</p>
                  <p className="text-sm text-gray-600">{time}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-600">{formatAddress(address)}</p>
                </div>
              </div>

              {/* Add-ons */}
              {(addOns.familyMembers > 0 || addOns.extendedTime > 0 || addOns.extraVisits > 0) && (
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Add-ons</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {addOns.familyMembers > 0 && <p>Family members: {addOns.familyMembers}</p>}
                      {addOns.extendedTime > 0 && (
                        <p>Extended time: +{addOns.extendedTime} minutes</p>
                      )}
                      {addOns.extraVisits > 0 && <p>Extra visits: {addOns.extraVisits}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {specialInstructions && (
                <div className="border-t pt-4">
                  <p className="font-medium mb-2">Special Instructions</p>
                  <p className="text-sm text-gray-600">{specialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment method selection */}
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground font-serif">Payment Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div
                  className={cn(
                    "border-2 rounded-lg p-4 cursor-pointer transition-all min-h-[60px] touch-manipulation",
                    paymentMethod === "card"
                      ? "border-primary bg-card text-foreground"
                      : "border-border hover:border-primary bg-background text-foreground"
                  )}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2",
                        paymentMethod === "card" ? "border-primary bg-primary" : "border-muted-foreground"
                      )}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-2 h-2 bg-background rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Pay per session</p>
                      <p className="text-sm text-muted-foreground font-light">One-time payment</p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "border-2 rounded-lg p-4 cursor-pointer transition-all min-h-[60px] touch-manipulation",
                    paymentMethod === "subscription"
                      ? "border-primary bg-card text-foreground"
                      : "border-border hover:border-primary bg-background text-foreground"
                  )}
                  onClick={() => setPaymentMethod("subscription")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2",
                        paymentMethod === "subscription"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {paymentMethod === "subscription" && (
                        <div className="w-2 h-2 bg-background rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">Save 20%</Badge>
                    <div>
                      <p className="font-medium text-foreground">Monthly membership</p>
                      <p className="text-sm text-muted-foreground font-light">4 sessions per month</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          {/* Pricing breakdown */}
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground font-serif">
                <DollarSign className="w-5 h-5 text-foreground" />
                <span>Pricing Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>{selectedService?.name}</span>
                <span>{formatPrice(selectedService?.basePrice || 0)}</span>
              </div>

              {addOns.familyMembers > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Family members ({addOns.familyMembers})</span>
                  <span>{formatPrice(addOns.familyMembers * 2500)}</span>
                </div>
              )}

              {addOns.extendedTime > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Extended time (+{addOns.extendedTime} min)</span>
                  <span>{formatPrice(addOns.extendedTime * 200)}</span>
                </div>
              )}

              {addOns.extraVisits > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Extra visits ({addOns.extraVisits})</span>
                  <span>
                    {formatPrice(addOns.extraVisits * (selectedService?.basePrice || 0) * 0.8)}
                  </span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Setup fee</span>
                  <span>{formatPrice(setupFee.totalSetupFee)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo code */}
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardContent className="pt-6">
              {isDevMode && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Development Mode</span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-2">
                    Available dev codes for payment bypass:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {availableDevCodes.map((code) => (
                      <button
                        key={code.code}
                        onClick={() => setPromoCode(code.code)}
                        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors min-h-[32px] min-w-[60px] touch-manipulation"
                        title={code.description}
                      >
                        {code.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 min-h-[44px]"
                />
                <Button variant="outline" onClick={handlePromoCodeApply} disabled={!promoCode} className="min-h-[44px] min-w-[70px]">
                  Apply
                </Button>
              </div>
              
              {promoApplied && promoDiscount > 0 && (
                <div className="mt-2">
                  {shouldBypassPayment ? (
                    <p className="text-sm text-blue-600 font-medium">
                      🔧 DEV MODE: Payment bypassed - booking will be free!
                    </p>
                  ) : (
                    <p className="text-sm text-green-600">
                      Promo code applied! You saved {formatPrice(promoDiscount)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guest Information - only show for non-authenticated users */}
          {isGuestBooking && (
            <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground font-serif">Contact Information</CardTitle>
                <CardDescription className="font-light">We'll create an account for you to manage your bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="guest-email" className="text-foreground">Email Address *</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-background border-input text-foreground"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guest-phone" className="text-foreground">Phone Number *</Label>
                  <Input
                    id="guest-phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="bg-background border-input text-foreground"
                    required
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                  <p className="text-sm text-blue-800 font-light">
                    <strong className="font-medium">New to Recovery Machine?</strong> We'll automatically create an account for you
                    with this email so you can track your bookings and earn referral credits.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment form */}
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground font-serif">
                <Lock className="w-5 h-5 text-foreground" />
                <span>Secure Payment</span>
              </CardTitle>
              <CardDescription className="font-light">Your payment information is encrypted and secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock payment form */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Secure payment processing powered by Stripe
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="secondary">Visa</Badge>
                  <Badge variant="secondary">Mastercard</Badge>
                  <Badge variant="secondary">Amex</Badge>
                  <Badge variant="secondary">Discover</Badge>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the terms and conditions
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By booking, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              {/* Cancellation policy */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your
                  appointment. Setup fees are non-refundable after equipment delivery.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="outline" onClick={onBack} disabled={isProcessingPayment} className="flex-1 min-h-[48px]">
            Back to Calendar
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!termsAccepted || isProcessingPayment}
            className="flex-1 min-h-[48px] text-sm"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>Complete - {formatPrice(calculateTotal())}</>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Navigation buttons */}
      <div className="hidden md:flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} size="lg" disabled={isProcessingPayment}>
          Back to Calendar
        </Button>

        <Button
          onClick={handlePayment}
          disabled={!termsAccepted || isProcessingPayment}
          size="lg"
          className="px-8"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>Complete Booking - {formatPrice(calculateTotal())}</>
          )}
        </Button>
      </div>
    </div>
  );
}
