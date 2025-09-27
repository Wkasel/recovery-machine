"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";
import { FormField } from "./FormField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface PasswordFieldProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  showStrengthIndicator?: boolean;
  className?: string;
}

export function PasswordField<TFieldValues extends FieldValues = FieldValues>({
  form,
  name,
  label = "Password",
  placeholder = "Enter your password",
  required = false,
  disabled = false,
  autoComplete = "current-password",
  showStrengthIndicator = false,
  className,
}: PasswordFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const password = form.watch(name) || "";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      form={form}
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className={className}
      leftIcon={<Lock className="w-4 h-4" />}
      rightIcon={
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      }
    >
      {showStrengthIndicator && password && (
        <PasswordStrengthIndicator password={password} className="mt-3" />
      )}
    </FormField>
  );
}