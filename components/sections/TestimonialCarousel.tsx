"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MapPin, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
  image: string;
  location: string;
  verified: boolean;
  sessionCount: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      {/* Featured Testimonial */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card className="bg-background border border-border">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Real Photo Side */}
              <div className="hidden md:block relative overflow-hidden">
                <img
                  src="/person-in-cold-plunge-photo.jpg"
                  alt="Person enjoying cold plunge recovery session"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <Quote className="h-12 w-12 text-mint mb-4" />
                  <blockquote className="text-xl text-charcoal leading-relaxed mb-6 font-medium" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                </div>

                <div className="flex items-center mb-6">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-mint-accent/30">
                    <AvatarFallback className="text-lg font-semibold bg-mint-accent/20 text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                      {testimonials[currentTestimonial].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-charcoal text-lg" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                        {testimonials[currentTestimonial].name}
                      </h4>
                      {testimonials[currentTestimonial].verified && (
                        <CheckCircle className="h-5 w-5 text-mint" />
                      )}
                    </div>
                    <p className="text-charcoal-light font-medium font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                      {testimonials[currentTestimonial].role}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonials[currentTestimonial].location}
                      </span>
                      <span>{testimonials[currentTestimonial].sessionCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-mint fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials
          .filter((_, index) => index !== currentTestimonial)
          .slice(0, 3)
          .map((testimonial) => (
            <Card key={testimonial.id} className="bg-mint-accent/10 border-2 border-mint-accent/20 hover:border-mint-accent/30 transition-all">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-mint fill-current" />
                  ))}
                </div>

                <blockquote className="text-charcoal-light mb-6 leading-relaxed line-clamp-3 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3 border-2 border-mint-accent/30">
                    <AvatarFallback className="font-semibold bg-mint-accent/20 text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <h4 className="font-semibold text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>{testimonial.name}</h4>
                      {testimonial.verified && <CheckCircle className="h-4 w-4 text-mint" />}
                    </div>
                    <p className="text-charcoal-light text-sm font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>{testimonial.role}</p>
                    <p className="text-charcoal-light/60 text-xs font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Testimonial Navigation */}
      <div className="flex justify-center mt-8 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentTestimonial ? "bg-mint w-8" : "bg-mint-accent/40 hover:bg-mint"
            }`}
            aria-label={`Select testimonial ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
