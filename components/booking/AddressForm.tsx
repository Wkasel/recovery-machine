// @ts-nocheck
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingService } from "@/lib/services/booking-service";
import { Address, addressSchema, SetupFeeCalculation } from "@/lib/types/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Clock, DollarSign, Loader2, MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

interface AddressFormProps {
  address?: Address;
  onAddressChange: (address: Address) => void;
  onSetupFeeCalculated: (setupFee: SetupFeeCalculation) => void;
  onNext: () => void;
  onBack: () => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function AddressForm({
  address,
  onAddressChange,
  onSetupFeeCalculated,
  onNext,
  onBack,
}: AddressFormProps) {
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [setupFee, setSetupFee] = useState<SetupFeeCalculation | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: address,
    mode: "onChange",
  });

  const watchedAddress = watch();

  const calculateSetupFee = useCallback(async (addressData: Address) => {
    if (!addressData.zipCode) return;

    setIsCalculatingFee(true);
    try {
      const feeCalculation = await BookingService.calculateSetupFee(addressData);
      setSetupFee(feeCalculation);
      onSetupFeeCalculated(feeCalculation);
    } catch (error) {
      console.error("Error calculating setup fee:", error);
    } finally {
      setIsCalculatingFee(false);
    }
  }, [onSetupFeeCalculated]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        setGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        setGoogleMapsLoaded(true);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const handlePlaceSelected = useCallback(() => {
    const place = autocompleteRef.current.getPlace();

    if (!place.address_components) return;

    const addressComponents = place.address_components;
    const getComponent = (type: string) => {
      const component = addressComponents.find((comp: any) => comp.types.includes(type));
      return component ? component.long_name : "";
    };

    const addressData: Address = {
      street: `${getComponent("street_number")} ${getComponent("route")}`.trim(),
      city: getComponent("locality") || getComponent("sublocality"),
      state: getComponent("administrative_area_level_1"),
      zipCode: getComponent("postal_code"),
      placeId: place.place_id,
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng(),
    };

    // Update form values
    Object.entries(addressData).forEach(([key, value]) => {
      if (value) {
        setValue(key as keyof Address, value, { shouldValidate: true });
      }
    });

    // Calculate setup fee
    calculateSetupFee(addressData);
  }, [setValue, calculateSetupFee]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (googleMapsLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address", "geometry", "place_id"],
      });

      autocompleteRef.current.addListener("place_changed", handlePlaceSelected);
    }
  }, [googleMapsLoaded, handlePlaceSelected]);

  const streetId = useId();
  const cityId = useId();
  const stateId = useId();
  const zipId = useId();

  const onSubmit = (data: Address) => {
    onAddressChange(data);
    onNext();
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Where should we set up?</h2>
        <p className="text-neutral-400">We'll bring the recovery experience right to your location</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20 md:pb-6">
        {/* Google Places Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="autocomplete-address" className="text-white">Search Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <Input
              ref={inputRef}
              placeholder="Start typing your address..."
              className="pl-10 bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500"
              onChange={(e) => {
                setValue("street", e.target.value, { shouldValidate: true });
              }}
            />
          </div>
          <p className="text-sm text-neutral-500">Start typing to see address suggestions</p>
        </div>

        {/* Manual address fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={streetId} className="text-white">Street Address *</Label>
            <Input
              {...register("street")}
              id={streetId}
              placeholder="123 Main St"
              className="bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 min-h-[44px]"
              onChange={async (e) => {
                setValue("street", e.target.value, { shouldValidate: true });
                await trigger();
              }}
            />
            {errors.street && <p className="text-sm text-red-600">{errors.street.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={cityId} className="text-white">City *</Label>
            <Input
              {...register("city")}
              id={cityId}
              placeholder="Orange County / Los Angeles"
              className="bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 min-h-[44px]"
              onChange={async (e) => {
                setValue("city", e.target.value, { shouldValidate: true });
                await trigger();
              }}
            />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={stateId} className="text-white">State *</Label>
            <Input
              {...register("state")}
              id={stateId}
              placeholder="CA"
              maxLength={2}
              className="bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 min-h-[44px]"
              onChange={async (e) => {
                setValue("state", e.target.value, { shouldValidate: true });
                await trigger();
              }}
            />
            {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={zipId} className="text-white">ZIP Code *</Label>
            <Input
              {...register("zipCode")}
              id={zipId}
              placeholder="90210"
              maxLength={10}
              className="bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 min-h-[44px]"
              onChange={async (e) => {
                setValue("zipCode", e.target.value, { shouldValidate: true });
                // Trigger validation for all fields to ensure form validity
                await trigger();
                if (e.target.value.length >= 5 && watchedAddress.city && watchedAddress.state) {
                  calculateSetupFee({
                    ...watchedAddress,
                    zipCode: e.target.value,
                  });
                }
              }}
            />
            {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode.message}</p>}
          </div>
        </div>

        {/* Setup fee calculation */}
        {isCalculatingFee && (
          <Card className="bg-black border border-neutral-800">
            <CardContent className="flex items-center justify-center py-6 text-white">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Calculating setup fee...</span>
            </CardContent>
          </Card>
        )}

        {setupFee && (
          <Card className="bg-black border border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <DollarSign className="w-5 h-5 text-white" />
                <span>Setup Fee Calculation</span>
              </CardTitle>
              <CardDescription className="text-neutral-400">One-time fee for equipment delivery and setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-400">Base setup fee:</span>
                    <span className="font-medium text-white">{formatPrice(setupFee.baseSetupFee)}</span>
                  </div>
                  {setupFee.distanceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-400">Distance fee:</span>
                      <span className="font-medium text-white">{formatPrice(setupFee.distanceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-white">Total setup fee:</span>
                    <span className="font-semibold text-lg text-white">
                      {formatPrice(setupFee.totalSetupFee)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-white" />
                    <span className="text-sm text-neutral-400">
                      Distance: {setupFee.distance} miles
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-sm text-neutral-400">
                      Est. travel time: {setupFee.estimatedTravelTime} min
                    </span>
                  </div>
                </div>
              </div>

              {setupFee.totalSetupFee >= 40000 && (
                <Alert className="bg-black border border-neutral-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-neutral-300">
                    This location has a higher setup fee due to distance. Consider choosing a
                    location closer to our service area to reduce costs.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service area info */}
        <Card className="bg-black border border-neutral-800">
          <CardContent className="py-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-white mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Service Area</h3>
                <p className="text-sm text-neutral-400">
                  We currently serve Orange County and Los Angeles areas. Setup fees vary based
                  on distance from our facility.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-neutral-900 text-white border border-neutral-800">
                    Newport Beach
                  </Badge>
                  <Badge variant="secondary" className="bg-neutral-900 text-white border border-neutral-800">
                    Irvine
                  </Badge>
                  <Badge variant="secondary" className="bg-neutral-900 text-white border border-neutral-800">
                    Huntington Beach
                  </Badge>
                  <Badge variant="secondary" className="bg-neutral-900 text-white border border-neutral-800">
                    Los Angeles
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Mobile Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 min-h-[48px]">
              Back to Service
            </Button>
            <Button type="submit" disabled={!isValid || !setupFee} className="flex-1 min-h-[48px]">
              Continue to Calendar
            </Button>
          </div>
        </div>

        {/* Desktop Navigation buttons */}
        <div className="hidden md:flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack} size="lg">
            Back to Service
          </Button>

          <Button type="submit" disabled={!isValid || !setupFee} size="lg" className="px-8">
            Continue to Calendar
          </Button>
        </div>
      </form>
    </div>
  );
}
