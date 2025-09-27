"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/typography/Typography";
import { Star, Quote, CheckCircle, MapPin } from "lucide-react";
import { FC } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar?: string;
  rating: number;
  quote: string;
  verified?: boolean;
  sessionCount?: string;
  beforeAfter?: {
    before: string;
    after: string;
    metric: string;
  };
}

interface LandingTestimonialsProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
  targetAudience?: string; // For filtering relevant testimonials
}

export const LandingTestimonials: FC<LandingTestimonialsProps> = ({
  title,
  subtitle,
  testimonials,
  targetAudience
}) => {
  // Filter testimonials based on target audience if specified
  const filteredTestimonials = targetAudience 
    ? testimonials.filter(t => 
        t.role.toLowerCase().includes(targetAudience.toLowerCase()) || 
        t.quote.toLowerCase().includes(targetAudience.toLowerCase())
      )
    : testimonials;

  const displayTestimonials = filteredTestimonials.slice(0, 6);

  return (
    <section className="py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Heading
            as="h2"
            size="display-md"
            weight="bold"
            className="mb-6 tracking-tight"
          >
            {title}
          </Heading>
          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </Text>
        </div>

        {/* Featured Testimonial */}
        {displayTestimonials.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="border-border shadow-lg">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Placeholder */}
                  <div className="hidden md:block relative overflow-hidden bg-muted">
                    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Star className="h-12 w-12 text-primary" />
                        </div>
                        <Text size="lg" weight="semibold" color="muted">
                          Real Recovery Results
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <Quote className="h-12 w-12 text-muted-foreground mb-6" />
                    
                    <blockquote className="text-xl text-foreground leading-relaxed mb-6 font-medium">
                      "{displayTestimonials[0].quote}"
                    </blockquote>

                    {/* Before/After Stats */}
                    {displayTestimonials[0].beforeAfter && (
                      <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <Text size="sm" weight="semibold" className="mb-2">
                          {displayTestimonials[0].beforeAfter.metric}
                        </Text>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Text size="xs" color="muted" className="uppercase tracking-wide">Before</Text>
                            <Text size="lg" weight="bold" className="text-red-600">
                              {displayTestimonials[0].beforeAfter.before}
                            </Text>
                          </div>
                          <div>
                            <Text size="xs" color="muted" className="uppercase tracking-wide">After</Text>
                            <Text size="lg" weight="bold" className="text-green-600">
                              {displayTestimonials[0].beforeAfter.after}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Author */}
                    <div className="flex items-center mb-6">
                      <Avatar className="h-16 w-16 mr-4 border border-border">
                        {displayTestimonials[0].avatar ? (
                          <AvatarImage src={displayTestimonials[0].avatar} />
                        ) : (
                          <AvatarFallback className="text-lg font-semibold">
                            {displayTestimonials[0].name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Heading as="h4" size="lg" weight="semibold">
                            {displayTestimonials[0].name}
                          </Heading>
                          {displayTestimonials[0].verified && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <Text size="base" color="muted" weight="medium">
                          {displayTestimonials[0].role}
                        </Text>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {displayTestimonials[0].location}
                          </span>
                          {displayTestimonials[0].sessionCount && (
                            <span>{displayTestimonials[0].sessionCount}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(displayTestimonials[0].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-primary fill-current" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        Verified Review
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Testimonials Grid */}
        {displayTestimonials.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.slice(1).map((testimonial) => (
              <Card key={testimonial.id} className="border-border hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-primary fill-current" />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Before/After */}
                  {testimonial.beforeAfter && (
                    <div className="bg-muted/50 p-3 rounded mb-4">
                      <Text size="xs" weight="semibold" className="mb-1">
                        {testimonial.beforeAfter.metric}
                      </Text>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-600">
                          {testimonial.beforeAfter.before}
                        </span>
                        <span className="text-sm font-semibold">→</span>
                        <span className="text-sm text-green-600">
                          {testimonial.beforeAfter.after}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 border border-border">
                      {testimonial.avatar ? (
                        <AvatarImage src={testimonial.avatar} />
                      ) : (
                        <AvatarFallback className="font-semibold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <Text size="base" weight="semibold">
                          {testimonial.name}
                        </Text>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <Text size="sm" color="muted">
                        {testimonial.role}
                      </Text>
                      <Text size="xs" color="muted">
                        {testimonial.location}
                      </Text>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};