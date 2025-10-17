"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Gift, Mail, Star } from "lucide-react";
import { useState } from "react";

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="bg-white/70 backdrop-blur-sm border-2 border-border rounded-3xl shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Welcome to Recovery Machine!</h3>
              <p className="text-muted-foreground mb-6 font-light">
                Thank you for subscribing! You'll now receive exclusive recovery tips and updates.
              </p>
              <Badge className="bg-primary/15 text-primary border border-primary/30 px-4 py-2 rounded-full shadow-sm">
                <Mail className="h-4 w-4 mr-2" />
                Successfully Subscribed
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <Card className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center mb-8">
              {/* Newsletter Badge */}
              <Badge className="bg-primary/15 text-primary border border-primary/30 rounded-full px-6 py-2 mb-6 text-sm font-semibold shadow-sm">
                <Mail className="h-4 w-4 mr-2" />
                Newsletter
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">Get recovery tips that work</h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 font-light">Short, actionable emails. One click to unsubscribe.</p>
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
                    className="h-12 px-4 text-lg bg-white border-2 border-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground rounded-2xl shadow-sm"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !email}
                  className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-semibold disabled:opacity-50 rounded-full shadow-md transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Expert Tips</h4>
                <p className="text-sm text-muted-foreground font-light">
                  Weekly recovery protocols from professionals
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-secondary/10 border-2 border-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  <Gift className="h-8 w-8 text-secondary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Exclusive Offers</h4>
                <p className="text-sm text-muted-foreground font-light">Member-only discounts and early access</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Success Stories</h4>
                <p className="text-sm text-muted-foreground font-light">Real results from our community</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">🔒 We won't spam you. Unsubscribe anytime.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
