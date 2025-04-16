"use client";

import React from "react";
import { AppError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Logger } from "@/lib/logger/Logger";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class RootErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log the error using the logger
    Logger.getInstance().error(
      "Uncaught client error",
      { component: "RootErrorBoundary", errorInfo },
      AppError.from(error)
    );
  }

  render() {
    if (this.state.error) {
      const error = AppError.from(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error.toUserMessage()}</p>
            <div className="space-y-4">
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="default"
                className="w-full"
              >
                Go to homepage
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-6 p-4 bg-muted rounded-lg text-left text-sm overflow-auto">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
