"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, ReactNode } from "react";

interface PaymentErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

interface PaymentErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export class PaymentErrorBoundary extends Component<
  PaymentErrorBoundaryProps,
  PaymentErrorBoundaryState
> {
  constructor(props: PaymentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): PaymentErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Payment Error Boundary caught an error:", error, errorInfo);

    // Report to error tracking service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  async render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Payment Processing Error</AlertTitle>
            <AlertDescription>
              We encountered an issue processing your payment. Your card has not been charged.
              Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-4">
            <Button onClick={this.handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = "/contact")} variant="default">
              Contact Support
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-4 p-4 bg-red-50 rounded-md text-sm">
              <summary className="cursor-pointer font-medium">
                Debug Information (Development Only)
              </summary>
              <pre className="mt-2 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
