"use client";

import { GoogleOneTap } from "@/components/auth";
import { MagicLink } from "@/components/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
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
  );
}
