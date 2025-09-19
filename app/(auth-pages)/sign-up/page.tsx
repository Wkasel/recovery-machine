"use client";

import { GoogleOneTap } from "@/components/auth";
import { MagicLink } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Snowflake className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Recovery Machine</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Join Recovery Machine</h1>
            <p className="text-sm text-muted-foreground">
              Start your recovery journey with cold plunge and infrared sauna sessions
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create account</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign-up method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="google" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
              
              <TabsContent value="google" className="space-y-4 mt-6">
                <Suspense fallback={<div>Loading...</div>}>
                  <GoogleOneTap />
                </Suspense>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Sign up quickly and securely with your Google account
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4 mt-6">
                <MagicLink pageType="sign-up" />
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
              
              <div className="text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
