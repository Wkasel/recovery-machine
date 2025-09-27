"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/use-toast";
import { AlertTriangle, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentResult {
  status: "success" | "pending" | "failed";
  orderId?: string;
  checkoutId?: string;
  amount?: number;
  transactionId?: string;
  subscriptionId?: string;
  error?: string;
}

export function PaymentSuccess() {
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const checkoutId = searchParams?.get("checkout_id");
  const orderId = searchParams?.get("order_id");

  useEffect(() => {
    if (!checkoutId && !orderId) {
      setResult({ status: "failed", error: "No payment information found" });
      setLoading(false);
      return;
    }

    checkPaymentStatus();
  }, [checkoutId, orderId]);

  const checkPaymentStatus = async () => {
    try {
      const params = new URLSearchParams();
      if (checkoutId) params.append("checkout_id", checkoutId);
      if (orderId) params.append("order_id", orderId);

      const response = await fetch(`/api/payments/checkout?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();

      // Determine status based on order status
      let status: "success" | "pending" | "failed" = "pending";
      if (data.status === "paid") {
        status = "success";
      } else if (data.status === "failed") {
        status = "failed";
      }

      setResult({
        status,
        orderId: data.order_id,
        checkoutId: data.checkout_id,
        amount: data.amount,
        transactionId: data.bolt_status?.transaction_id,
        subscriptionId: data.bolt_status?.subscription_id,
        error: data.error,
      });

      if (status === "success") {
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
        });
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      setResult({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      toast({
        title: "Error",
        description: "Failed to verify payment status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getStatusIcon = () => {
    switch (result?.status) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case "failed":
        return <AlertTriangle className="h-16 w-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (result?.status) {
      case "success":
        return {
          title: "Payment Successful!",
          description:
            "Your payment has been processed successfully. You can now access your services.",
        };
      case "pending":
        return {
          title: "Payment Processing",
          description: "Your payment is being processed. This may take a few minutes.",
        };
      case "failed":
        return {
          title: "Payment Failed",
          description:
            result.error || "There was an issue processing your payment. Please try again.",
        };
      default:
        return {
          title: "Checking Payment Status",
          description: "Please wait while we verify your payment...",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verifying payment status...</p>
        </Card>
      </div>
    );
  }

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">{getStatusIcon()}</div>

        <h1 className="text-2xl font-bold mb-2">{statusMessage.title}</h1>
        <p className="text-gray-600 mb-6">{statusMessage.description}</p>

        {result && (
          <div className="space-y-4 mb-6">
            {result.orderId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono">{result.orderId}</span>
              </div>
            )}

            {result.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold">{formatAmount(result.amount)}</span>
              </div>
            )}

            {result.transactionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-xs">{result.transactionId}</span>
              </div>
            )}

            {result.subscriptionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subscription ID:</span>
                <span className="font-mono text-xs">{result.subscriptionId}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {result?.status === "success" && (
            <>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {result.subscriptionId && (
                <Button
                  onClick={() => router.push("/booking")}
                  variant="outline"
                  className="w-full"
                >
                  Book Your First Session
                </Button>
              )}
            </>
          )}

          {result?.status === "pending" && (
            <Button onClick={checkPaymentStatus} variant="outline" className="w-full">
              Check Status Again
            </Button>
          )}

          {result?.status === "failed" && (
            <>
              <Button onClick={() => router.push("/pricing")} className="w-full">
                Try Again
              </Button>
              <Button onClick={() => router.push("/support")} variant="outline" className="w-full">
                Contact Support
              </Button>
            </>
          )}

          <Button onClick={() => router.push("/")} variant="ghost" className="w-full">
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Payment cancellation component
export function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <div className="space-y-3">
          <Button onClick={() => router.push("/pricing")} className="w-full">
            Try Again
          </Button>

          <Button onClick={() => router.push("/")} variant="outline" className="w-full">
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
