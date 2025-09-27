"use client";

import React from "react";
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  leftIcon,
  rightIcon,
  className,
  inputClassName,
  children,
}: FormFieldProps<TFieldValues>) {
  const fieldError = form.formState.errors[name];
  const hasError = !!fieldError;
  const errorMessage = fieldError?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={name}
        className={cn(
          "text-sm font-medium text-foreground",
          required && "after:content-['*'] after:text-destructive after:ml-1"
        )}
      >
        {label}
      </Label>
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(
            "transition-all duration-200",
            hasError && "border-destructive focus-visible:ring-destructive",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            inputClassName
          )}
          {...form.register(name)}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      
      {children}
      
      {(errorMessage || helperText) && (
        <p className={cn(
          "text-xs mt-1.5",
          hasError ? "text-destructive" : "text-muted-foreground"
        )}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
}