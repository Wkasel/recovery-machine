"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceType, services } from "@/lib/types/booking";
import { cn } from "@/lib/utils";
import { Check, Clock, DollarSign, Star } from "lucide-react";
import { useState } from "react";

interface ServiceSelectionProps {
  selectedService?: ServiceType;
  onServiceSelect: (serviceType: ServiceType) => void;
  onNext: () => void;
}

export function ServiceSelection({
  selectedService,
  onServiceSelect,
  onNext,
}: ServiceSelectionProps) {
  const [hoveredService, setHoveredService] = useState<ServiceType | null>(null);

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  const handleServiceSelect = (serviceType: ServiceType) => {
    onServiceSelect(serviceType);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2 tracking-tight">Choose Your Recovery Experience</h2>
        <p className="text-muted-foreground font-light">Select the service that best fits your wellness goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 md:pb-6">
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const isHovered = hoveredService === service.id;

          return (
            <Card
              key={service.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 border-2 min-h-[44px]",
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-md",
                service.popular && "ring-2 ring-amber-200 border-amber-300"
              )}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() => handleServiceSelect(service.id)}
            >
              {/* Popular badge */}
              {service.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-serif font-semibold text-foreground">{service.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground font-light">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      {formatPrice(service.basePrice)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Includes:</p>
                  <ul className="space-y-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service-specific highlights */}
                {service.id === "cold_plunge" && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-800">
                      Perfect for post-workout recovery and inflammation reduction
                    </p>
                  </div>
                )}

                {service.id === "infrared_sauna" && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-red-800">
                      Ideal for detoxification and deep relaxation
                    </p>
                  </div>
                )}

                {service.id === "combo_package" && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-800">
                      Complete recovery experience with maximum benefits
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add-on options preview */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-4 shadow-md">
        <h3 className="text-lg font-serif font-semibold text-foreground mb-3">Available Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Extra family members (+$25 each)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Extended session time (+$2/min)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Additional visits this week</span>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button onClick={onNext} disabled={!selectedService} className="flex-1 min-h-[48px]">
            Continue to Location
          </Button>
        </div>
      </div>

      {/* Desktop Next button */}
      <div className="hidden md:flex justify-end pt-6">
        <Button onClick={onNext} disabled={!selectedService} size="lg" className="px-8">
          Continue to Location
        </Button>
      </div>
    </div>
  );
}
