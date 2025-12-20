"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="The Recovery Machine"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <Card className="w-full bg-white/70 backdrop-blur-sm border-mint-accent/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-mint-accent/20 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-mint" />
                </div>

                <h1
                  className="text-2xl font-semibold tracking-tight text-charcoal"
                  style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                >
                  Check your email
                </h1>

                <p
                  className="text-sm text-charcoal-light font-light"
                  style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                >
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-medium text-charcoal">{decodeURIComponent(email)}</span>
                </p>

                <div className="bg-mint-accent/10 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-mint mt-0.5 flex-shrink-0" />
                    <div
                      className="text-sm text-charcoal-light"
                      style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                    >
                      <p className="font-medium text-charcoal mb-1">Next steps:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Check your inbox (and spam folder)</li>
                        <li>Click the verification link in the email</li>
                        <li>You&apos;ll be signed in automatically</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                    style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                  >
                    <Link href="/sign-in">Back to Sign In</Link>
                  </Button>
                </div>

                <p
                  className="text-xs text-charcoal-light pt-2"
                  style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                >
                  Didn&apos;t receive an email? Check your spam folder or try signing up again.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-mint border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
