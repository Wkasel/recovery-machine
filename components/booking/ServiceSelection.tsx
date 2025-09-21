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
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Recovery Experience</h2>
        <p className="text-neutral-400">Select the service that best fits your wellness goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const isHovered = hoveredService === service.id;

          return (
            <Card
              key={service.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 border-2",
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
                <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                <CardDescription className="text-sm text-neutral-400">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(service.basePrice)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-neutral-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Includes:</p>
                  <ul className="space-y-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-400">{feature}</span>
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
      <div className="bg-neutral-900 border border-neutral-800 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Available Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Extra family members (+$25 each)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Extended session time (+$2/min)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Additional visits this week</span>
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-6">
        <Button onClick={onNext} disabled={!selectedService} size="lg" className="px-8">
          Continue to Location
        </Button>
      </div>
    </div>
  );
}
