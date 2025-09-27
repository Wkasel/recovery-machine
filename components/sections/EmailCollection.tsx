"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ArrowRight, CheckCircle, Gift, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

export default function EmailCollection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();

      // Insert email into the database
      const { error: insertError } = await supabase.from("email_subscribers").insert([
        {
          email: email,
          source: "homepage_cta",
          subscribed_at: new Date().toISOString(),
          tags: ["homepage", "early_access"],
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setIsSubmitted(true);
      setEmail("");
    } catch (err: any) {
      console.error("Email subscription error:", err);
      if (err.code === "23505") {
        setError("This email is already subscribed!");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Exclusive early access to new services",
    "Special pricing and member-only discounts",
    "Recovery tips from certified specialists",
    "Priority booking for high-demand times",
  ];

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center shadow-xl">
            <CardContent className="p-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You're In!</h2>
              <p className="text-xl text-gray-600 mb-6">
                Welcome to Recovery Machine. Check your email for exclusive early access details.
              </p>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  🎉 You'll receive your welcome guide and special pricing within the next few
                  minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center mb-6">
                <Gift className="w-8 h-8 text-yellow-400 mr-3" />
                <span className="bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-yellow-50 px-3 py-1 rounded-full text-sm font-semibold">
                  Early Access Offer
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Recovery Revolution</h2>

              <p className="text-xl opacity-90 mb-8">
                Be among the first to experience mobile recovery services in your area. Get
                exclusive access and special launch pricing.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="opacity-90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Early Access</h3>
                    <p className="text-gray-600">
                      Join our waitlist and be first to know when we launch in your area.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-lg py-3"
                        disabled={isLoading}
                      />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-lg py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Subscribing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Get Early Access
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      By subscribing, you agree to receive marketing emails from Recovery Machine.
                      You can unsubscribe at any time.
                    </p>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>💰 Save $100 on setup</span>
                      <span>🚀 Priority booking</span>
                      <span>📧 Exclusive tips</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
