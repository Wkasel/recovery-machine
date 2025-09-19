import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Instagram, Users, TrendingUp, CheckCircle, MapPin, Quote } from "lucide-react";
import Link from "next/link";
import { TestimonialCarousel } from "./TestimonialCarousel";

// Enhanced testimonials with professional photos
export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Marathon Runner",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "Transformed my recovery routine – feel unstoppable after every session! The convenience of professional recovery at home is unmatched.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    location: "New York, NY",
    verified: true,
    sessionCount: "25+ sessions"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CrossFit Athlete",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "The convenience of having professional equipment at home is game-changing. My recovery time has improved dramatically.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    location: "Los Angeles, CA",
    verified: true,
    sessionCount: "40+ sessions"
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Physical Therapist",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "My patients see incredible results. The contrast therapy is scientifically proven and this service makes it accessible.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    location: "Miami, FL",
    verified: true,
    sessionCount: "Professional Partner"
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Business Executive",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "Perfect for busy schedules. Recovery without leaving home is a productivity hack that's transformed my energy levels.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    location: "Chicago, IL",
    verified: true,
    sessionCount: "15+ sessions"
  },
  {
    id: 5,
    name: "Jessica Park",
    role: "Wellness Coach",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "The mental clarity and physical benefits are immediate. I recommend this to all my clients seeking peak performance.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    location: "Austin, TX",
    verified: true,
    sessionCount: "30+ sessions"
  }
];

// Instagram posts now handled by Behold.so widget
// This eliminates API rate limits and maintenance overhead
// Configuration is managed through Behold.so dashboard

const stats = [
  { 
    icon: Users, 
    value: "500+", 
    label: "Active Members"
  },
  { 
    icon: Star, 
    value: "4.8/5", 
    label: "Average Rating"
  },
  { 
    icon: TrendingUp, 
    value: "95%", 
    label: "Member Satisfaction"
  }
];

export function SocialProof() {

  return (
    <section className="py-24 lg:py-32 bg-black">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Stats Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 border border-neutral-800 text-sm font-semibold mb-8">
            <Star className="h-4 w-4" />
            <span>Trusted by Athletes & Professionals</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
            Join 500+ High Performers
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            Athletes, executives, and wellness professionals trust us for 
            <span className="font-semibold text-white"> consistent, professional recovery</span> at their doorstep.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-8 bg-black border border-neutral-800"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-3">{stat.value}</div>
                  <div className="text-neutral-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Testimonials Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real Stories, Real Results
            </h3>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Hear from athletes, professionals, and wellness experts who've transformed their recovery routine
            </p>
          </div>
          
          {/* Featured Testimonial */}
          <TestimonialCarousel testimonials={testimonials} />
        </div>

        {/* Instagram Section - Behold.so Integration */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            See Real Recoveries in Action
          </h3>
          <p className="text-neutral-400 mb-8">
            Follow <span className="font-semibold text-white">@therecoverymachine</span> for daily inspiration
          </p>
          
          {/* Behold.so Instagram Widget */}
          <div className="mb-8">
            <div 
              id="behold-widget" 
              className="min-h-[400px] rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: `
                  <script>
                    (() => {
                      const script = document.createElement('script');
                      script.src = 'https://w.behold.so/widget.js';
                      script.type = 'module';
                      script.onload = () => {
                        if (window.BeholdWidget) {
                          window.BeholdWidget.render({
                            widgetId: 'your-widget-id',
                            container: '#behold-widget'
                          });
                        }
                      };
                      if (!document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
                        document.head.appendChild(script);
                      }
                    })();
                  </script>
                  <div id="behold-instagram-feed" style="min-height: 400px; display: flex; align-items: center; justify-content: center; background: linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 8px;">
                    <div style="text-align: center; color: #6b7280;">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="margin: 0 auto 16px;">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <p style="font-weight: 600; margin-bottom: 8px;">Instagram Feed Loading...</p>
                      <p style="font-size: 14px;">Powered by Behold.so</p>
                    </div>
                  </div>
                `
              }}
            />
          </div>

          <Button asChild variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-neutral-900 hover:border-white">
            <Link href="https://instagram.com/therecoverymachine" target="_blank" className="inline-flex items-center">
              <Instagram className="h-5 w-5 mr-2" />
              Follow on Instagram
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}