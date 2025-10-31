"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/use-toast";
import { PRICING, type OrderType } from "@/lib/stripe/config";
import { CreditCard, Loader2, Shield } from "lucide-react";
import { useState } from "react";

interface StripeCheckoutProps {
  amount: number;
  orderType: OrderType;
  description: string;
  customerEmail: string;
  customerPhone?: string;
  metadata?: Record<string, any>;
  prefetchedSession?: {
    sessionId: string;
    checkoutUrl: string;
  };
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export function StripeCheckout({
  amount,
  orderType,
  description,
  customerEmail,
  customerPhone,
  metadata = {},
  prefetchedSession,
  onSuccess,
  onError,
  onCancel,
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize Stripe checkout and redirect
  const initializeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      if (prefetchedSession?.checkoutUrl) {
        window.location.href = prefetchedSession.checkoutUrl;
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "USD",
          order_reference: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          description,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          order_type: orderType,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      onError?.(err);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    } finally {
      if (!prefetchedSession?.checkoutUrl) {
        setLoading(false);
      }
    }
  };

  // Format amount for display
  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // Get order type display name
  const getOrderTypeDisplay = (type: OrderType) => {
    switch (type) {
      case "subscription":
        return "Monthly Subscription";
      case "setup_fee":
        return "Setup Fee";
      case "one_time":
        return "One-time Payment";
      default:
        return "Payment";
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Secure Payment</h3>
            </div>
            <div className="text-sm text-muted-foreground">{getOrderTypeDisplay(orderType)}</div>
            <div className="text-2xl font-bold text-foreground">{formatAmount(amount)}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secured by Stripe</span>
          </div>

          {/* Checkout Action */}
          {!loading && !error && (
            <Button onClick={initializeCheckout} className="w-full" size="lg">
              Continue to Payment
            </Button>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Redirecting to secure payment...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-3">
              <div className="text-sm text-red-600 text-center">{error}</div>
              <Button onClick={initializeCheckout} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          )}

          {/* Payment Information */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{customerEmail}</span>
            </div>
            {customerPhone && (
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>Credit Card</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Pricing display component
export function PricingDisplay() {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <h4 className="font-semibold mb-2">Recovery Lite</h4>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(PRICING.SUBSCRIPTIONS.RECOVERY_LITE)}
        </div>
        <div className="text-sm text-muted-foreground">per month - 2 visits</div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-2">Full Spectrum</h4>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(PRICING.SUBSCRIPTIONS.FULL_SPECTRUM)}
        </div>
        <div className="text-sm text-muted-foreground">per month - 4 visits</div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-2">Elite Performance</h4>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(PRICING.SUBSCRIPTIONS.ELITE_PERFORMANCE)}
        </div>
        <div className="text-sm text-muted-foreground">per month - 8 visits</div>
      </Card>
    </div>
  );
}
