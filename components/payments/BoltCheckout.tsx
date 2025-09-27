"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/use-toast";
import { PRICING, type OrderType } from "@/lib/bolt/config";
import { CreditCard, Loader2, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BoltCheckoutProps {
  amount: number;
  orderType: OrderType;
  description: string;
  customerEmail: string;
  customerPhone?: string;
  metadata?: Record<string, any>;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

interface BoltCheckoutResult {
  status: "success" | "error" | "cancelled";
  checkout_id?: string;
  transaction_id?: string;
  error?: string;
}

export function BoltCheckout({
  amount,
  orderType,
  description,
  customerEmail,
  customerPhone,
  metadata = {},
  onSuccess,
  onError,
  onCancel,
}: BoltCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Initialize Bolt checkout
  const initializeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payments/checkout", {
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
      setCheckoutUrl(data.checkout_url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      onError?.(err);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle iframe messages from Bolt
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://checkout.bolt.com" &&
        event.origin !== "https://checkout-sandbox.bolt.com"
      ) {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case "bolt_checkout_success":
          onSuccess?.(data);
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed successfully.",
          });
          break;

        case "bolt_checkout_error":
          onError?.(data);
          toast({
            title: "Payment Failed",
            description: data.error || "Payment could not be processed.",
            variant: "destructive",
          });
          break;

        case "bolt_checkout_cancelled":
          onCancel?.();
          toast({
            title: "Payment Cancelled",
            description: "Payment has been cancelled.",
            variant: "destructive",
          });
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onError, onCancel, toast]);

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
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Secure Payment</h3>
            </div>
            <div className="text-sm text-gray-600">{getOrderTypeDisplay(orderType)}</div>
            <div className="text-2xl font-bold text-gray-900">{formatAmount(amount)}</div>
            <div className="text-sm text-gray-500">{description}</div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secured by Bolt</span>
          </div>

          {/* Checkout Action */}
          {!checkoutUrl && !loading && !error && (
            <Button onClick={initializeCheckout} className="w-full" size="lg">
              Continue to Payment
            </Button>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Initializing secure payment...</span>
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

          {/* Bolt Checkout Iframe */}
          {checkoutUrl && (
            <div className="space-y-3">
              <div className="relative">
                <iframe
                  ref={iframeRef}
                  src={checkoutUrl}
                  className="w-full h-96 border border-gray-200 rounded-lg"
                  title="Bolt Checkout"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                Complete your payment in the secure frame above
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="text-xs text-gray-500 space-y-1">
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <h4 className="font-semibold mb-2">Monthly Subscription</h4>
        <div className="text-2xl font-bold text-blue-600">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(PRICING.MONTHLY_SUBSCRIPTION / 100)}
        </div>
        <div className="text-sm text-gray-500">per month</div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-2">Setup Fees</h4>
        <div className="text-lg font-bold text-green-600">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(PRICING.SETUP_FEES.BASIC / 100)}
          {" - "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(PRICING.SETUP_FEES.DELUXE / 100)}
        </div>
        <div className="text-sm text-gray-500">one-time</div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-2">Add-ons</h4>
        <div className="text-lg font-bold text-purple-600">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(PRICING.ADD_ONS.EXTENDED_SAUNA / 100)}
          {" - "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(PRICING.ADD_ONS.FAMILY_PACKAGE / 100)}
        </div>
        <div className="text-sm text-gray-500">per session</div>
      </Card>
    </div>
  );
}
