"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookingPage(): React.ReactElement {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-4">
              Book Your Recovery Session
            </CardTitle>
            <p className="text-neutral-400">
              Professional cold plunge & infrared sauna delivered to your door
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
              <p className="text-neutral-400 mb-6">
                Our booking system is being updated to provide you with the best experience. Please
                contact us directly to schedule your session.
              </p>

              <div className="space-y-4">
                <Button asChild className="w-full bg-white text-black hover:bg-neutral-200">
                  <Link href="/contact">Contact Us to Book</Link>
                </Button>

                <div className="text-sm text-neutral-500">
                  <p>📞 Call: (555) 123-4567</p>
                  <p>📧 Email: book@therecoverymachine.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
