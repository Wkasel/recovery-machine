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
        <DialogContent className="bg-background border-2 border-mint-accent text-charcoal max-w-md">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-mint-accent/20 border-2 border-mint-accent rounded-lg flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-mint" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Welcome to Recovery Machine!</h3>
            <p className="text-charcoal-light mb-6 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Thank you for subscribing! Check your email for your 10% discount code.
            </p>
            <Badge className="bg-mint-accent/20 text-charcoal border-2 border-mint-accent px-4 py-2" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
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
      <DialogContent className="bg-background border-2 border-mint-accent text-charcoal max-w-lg p-0">
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
          className="absolute right-4 top-4 text-charcoal-light hover:text-charcoal hover:bg-mint-accent/10 z-10 rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="p-8">
          <div className="text-center mb-8">
            {/* Incentive Badge */}
            <Badge className="bg-mint-accent/20 text-charcoal border-2 border-mint-accent px-6 py-2 mb-6 text-sm font-semibold" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              <Gift className="h-4 w-4 mr-2" />
              Limited Time Offer
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Welcome! Get 10% Off Your First Month
            </h2>
            <p className="text-charcoal-light mb-4 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Join our community of high performers and unlock expert recovery strategies
            </p>

            {/* Value Proposition */}
            <div className="flex items-center justify-center gap-2 text-charcoal font-semibold mb-8" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              <Star className="h-5 w-5 fill-current text-mint" />
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
                className="h-12 px-4 text-lg bg-white border-2 border-mint-accent/30 focus:border-mint text-charcoal placeholder:text-charcoal-light/50 rounded-lg"
                style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !email}
                className="h-12 px-8 bg-charcoal text-white hover:bg-charcoal/90 font-semibold disabled:opacity-50 rounded-full hover:scale-105 transition-all"
                style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
              <div className="w-10 h-10 bg-mint-accent/20 border-2 border-mint-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Mail className="h-5 w-5 text-mint" />
              </div>
              <h4 className="font-semibold text-charcoal text-sm mb-1" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Expert Tips</h4>
              <p className="text-xs text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Weekly protocols</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-mint-accent/20 border-2 border-mint-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Gift className="h-5 w-5 text-mint" />
              </div>
              <h4 className="font-semibold text-charcoal text-sm mb-1" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Exclusive Offers</h4>
              <p className="text-xs text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Member discounts</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-mint-accent/20 border-2 border-mint-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-mint" />
              </div>
              <h4 className="font-semibold text-charcoal text-sm mb-1" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Success Stories</h4>
              <p className="text-xs text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Real results</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6 pt-4 border-t border-mint-accent/20">
            <p className="text-xs text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              🔒 No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
