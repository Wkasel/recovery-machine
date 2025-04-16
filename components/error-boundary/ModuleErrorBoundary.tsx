"use client";

import React from "react";
import { AppError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Logger } from "@/lib/logger/Logger";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  error: Error | null;
}

export class ModuleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error using the logger
    Logger.getInstance().error(
      "Uncaught module error",
      { component: "ModuleErrorBoundary", errorInfo },
      AppError.from(error)
    );
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = AppError.from(this.state.error);

      return (
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error.toUserMessage()}</p>
            <Button onClick={this.handleReset} variant="outline" size="sm">
              Try again
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 p-2 bg-muted rounded text-xs overflow-auto">{error.stack}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
