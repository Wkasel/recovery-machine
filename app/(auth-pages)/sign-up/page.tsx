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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center bg-white text-black">
              <Snowflake className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-white">Recovery Machine</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Join Recovery Machine</h1>
            <p className="text-sm text-neutral-400">
              Start your recovery journey with cold plunge and infrared sauna sessions
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="bg-black border border-neutral-800">
          <CardContent className="p-6 space-y-4">
            <Tabs defaultValue="google" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-neutral-900 border border-neutral-800">
                <TabsTrigger value="google" className="text-white data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Google</TabsTrigger>
                <TabsTrigger value="email" className="text-white data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Email</TabsTrigger>
              </TabsList>
              
              <TabsContent value="google" className="space-y-4 mt-6">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                  <GoogleOneTap />
                </Suspense>
                <div className="text-center">
                  <p className="text-sm text-neutral-400">
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
                <Separator className="w-full border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-neutral-400">Or</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-neutral-400">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-white font-medium hover:underline">
                  Sign in
                </Link>
              </p>
              
              <div className="text-xs text-neutral-500">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-white hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-white hover:underline">
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
