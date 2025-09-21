"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRight, Gift, Mail, Star, X } from "lucide-react";
import { useState } from "react";

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfferModal({ isOpen, onClose }: OfferModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // Simulate API call - in production, this would call your Supabase function
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail("");
      
      // Close modal after a brief delay to show success
      setTimeout(() => {
        onClose();
        setIsSubscribed(false);
      }, 2000);
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black border-2 border-neutral-800 text-white max-w-md">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Welcome to Recovery Machine!</h3>
            <p className="text-neutral-400 mb-6">
              Thank you for subscribing! Check your email for your 10% discount code.
            </p>
            <Badge className="bg-neutral-900 text-white border border-neutral-800 px-4 py-2">
              <Gift className="h-4 w-4 mr-2" />
              10% Off Code Sent
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-neutral-800 text-white max-w-lg p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Limited Time Offer</DialogTitle>
          <DialogDescription>
            Get 10% off your first month and exclusive recovery tips
          </DialogDescription>
        </DialogHeader>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white hover:bg-neutral-800 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="p-8">
          <div className="text-center mb-8">
            {/* Incentive Badge */}
            <Badge className="bg-neutral-900 text-white border border-neutral-800 px-6 py-2 mb-6 text-sm font-semibold">
              <Gift className="h-4 w-4 mr-2" />
              Limited Time Offer
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Welcome! Get 10% Off Your First Month
            </h2>
            <p className="text-neutral-400 mb-4">
              Join our community of high performers and unlock expert recovery strategies
            </p>

            {/* Value Proposition */}
            <div className="flex items-center justify-center gap-2 text-white font-semibold mb-8">
              <Star className="h-5 w-5 fill-current" />
              <span>Plus exclusive recovery tips weekly</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-4 text-lg bg-neutral-900 border-2 border-neutral-800 focus:border-white text-white placeholder:text-neutral-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !email}
                className="h-12 px-8 bg-white text-black hover:bg-neutral-200 font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Claim 10% Off
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Benefits Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-2">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Expert Tips</h4>
              <p className="text-xs text-neutral-400">Weekly protocols</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-2">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Exclusive Offers</h4>
              <p className="text-xs text-neutral-400">Member discounts</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Success Stories</h4>
              <p className="text-xs text-neutral-400">Real results</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6 pt-4 border-t border-neutral-800">
            <p className="text-xs text-neutral-500">
              🔒 No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}