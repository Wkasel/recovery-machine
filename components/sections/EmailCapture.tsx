"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Mail, Gift, Star, ArrowRight } from "lucide-react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call - in production, this would call your Supabase function
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="bg-black border-2 border-neutral-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Welcome to Recovery Machine!
              </h3>
              <p className="text-neutral-400 mb-6">
                Thank you for subscribing! Check your email for your 10% discount code 
                and exclusive recovery tips.
              </p>
              <Badge className="bg-neutral-900 text-white border border-neutral-800 px-4 py-2">
                <Gift className="h-4 w-4 mr-2" />
                10% Off Code Sent
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <Card className="bg-black border border-neutral-800">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center mb-8">
              {/* Incentive Badge */}
              <Badge className="bg-neutral-900 text-white border border-neutral-800 px-6 py-2 mb-6 text-sm font-semibold">
                <Gift className="h-4 w-4 mr-2" />
                Limited Time Offer
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get Recovery Tips & Exclusive Offers
              </h2>
              <p className="text-lg sm:text-xl text-neutral-400 mb-2">
                Join our community of high performers and unlock expert recovery strategies
              </p>
              
              {/* Value Proposition */}
              <div className="flex items-center justify-center gap-2 text-white font-semibold mb-8">
                <Star className="h-5 w-5 fill-current" />
                <span>Unlock 10% off your first month</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 px-4 text-lg bg-neutral-900 border-2 border-neutral-800 focus:border-white text-white placeholder:text-neutral-500"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !email}
                  className="h-12 px-8 bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Get 10% Off
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-neutral-800">
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Expert Tips</h4>
                <p className="text-sm text-neutral-400">Weekly recovery protocols from professionals</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-3">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Exclusive Offers</h4>
                <p className="text-sm text-neutral-400">Member-only discounts and early access</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Success Stories</h4>
                <p className="text-sm text-neutral-400">Real results from our community</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-8 pt-6 border-t border-neutral-800">
              <p className="text-sm text-neutral-500">
                🔒 Your email is safe with us. Unsubscribe anytime. No spam, ever.
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                Join 2,500+ subscribers who trust Recovery Machine
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}