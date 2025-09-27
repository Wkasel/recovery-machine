"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { getPasswordStrength } from "../validation/auth-schemas";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, label, color, checks } = getPasswordStrength(password);

  const requirements = [
    { key: "length", label: "At least 8 characters", checked: checks.length },
    { key: "lowercase", label: "One lowercase letter", checked: checks.lowercase },
    { key: "uppercase", label: "One uppercase letter", checked: checks.uppercase },
    { key: "number", label: "One number", checked: checks.number },
    { key: "special", label: "One special character", checked: checks.special },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">Password strength</span>
          <span className={cn(
            "text-xs font-medium",
            score >= 4 ? "text-green-600 dark:text-green-400" :
            score >= 3 ? "text-yellow-600 dark:text-yellow-400" :
            score >= 2 ? "text-orange-600 dark:text-orange-400" :
            "text-red-600 dark:text-red-400"
          )}>
            {label}
          </span>
        </div>
        
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-300",
                level <= score
                  ? score >= 4 ? "bg-green-500" :
                    score >= 3 ? "bg-yellow-500" :
                    score >= 2 ? "bg-orange-500" :
                    "bg-red-500"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Requirements:</p>
        <div className="grid grid-cols-1 gap-1">
          {requirements.map((req) => (
            <div key={req.key} className="flex items-center gap-2">
              <div className={cn(
                "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                req.checked 
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              )}>
                {req.checked ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <X className="w-2.5 h-2.5" />
                )}
              </div>
              <span className={cn(
                "text-xs transition-colors",
                req.checked ? "text-foreground" : "text-muted-foreground"
              )}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}