"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/enhanced/enhanced-input";
import { VStack } from "@/components/layout/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, User, ArrowRight, Github, Eye, EyeOff } from "lucide-react";

// Form schemas
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: SignInForm | SignUpForm) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function AuthForm({ mode, onSubmit, loading = false, error }: AuthFormProps) {
  const isSignUp = mode === "signup";
  const schema = isSignUp ? signUpSchema : signInSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <Card variant="elevated" size="lg" className="w-full max-w-md mx-auto">
      <CardHeader spacing="lg" padding="lg">
        <CardTitle size="2xl" className="text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription size="md" className="text-center">
          {isSignUp 
            ? "Sign up to start your recovery journey" 
            : "Sign in to your account to continue"
          }
        </CardDescription>
      </CardHeader>

      <CardContent padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <VStack spacing="lg">
            {isSignUp && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                startIcon={<User className="h-4 w-4" />}
                errorText={errors.name?.message}
                state={errors.name ? "error" : "default"}
                {...register("name")}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              startIcon={<Mail className="h-4 w-4" />}
              errorText={errors.email?.message}
              state={errors.email ? "error" : "default"}
              {...register("email")}
            />

            <PasswordInput
              label="Password"
              placeholder={isSignUp ? "Create a password" : "Enter your password"}
              errorText={errors.password?.message}
              state={errors.password ? "error" : "default"}
              {...register("password")}
            />

            {isSignUp && (
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                errorText={errors.confirmPassword?.message}
                state={errors.confirmPassword ? "error" : "default"}
                {...register("confirmPassword")}
              />
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={loading}
              loadingText={isSignUp ? "Creating account..." : "Signing in..."}
              fullWidth
              disabled={!isValid}
              endIcon={!loading && <ArrowRight className="h-4 w-4" />}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </VStack>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="mt-4"
            startIcon={<Github className="h-4 w-4" />}
          >
            GitHub
          </Button>
        </div>
      </CardContent>

      <CardFooter padding="lg" justify="center">
        <p className="text-sm text-muted-foreground text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isSignUp ? "/auth/signin" : "/auth/signup"}
            className="font-medium text-primary hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

// Specialized auth components
export function SignInForm(props: Omit<AuthFormProps, "mode">) {
  return <AuthForm mode="signin" {...props} />;
}

export function SignUpForm(props: Omit<AuthFormProps, "mode">) {
  return <AuthForm mode="signup" {...props} />;
}