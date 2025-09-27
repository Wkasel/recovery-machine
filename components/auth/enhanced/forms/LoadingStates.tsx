"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function AuthFormSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse" />
        </div>
        
        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
          
          {/* Button */}
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Footer */}
        <div className="text-center pt-4 border-t">
          <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}