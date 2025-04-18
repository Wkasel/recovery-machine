"use client";

import { Button } from "@/components/ui/button";
import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

interface IState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class RootErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): IState {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
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

  render(): React.ReactNode {
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

// Default export for barrel file
export default RootErrorBoundary;
