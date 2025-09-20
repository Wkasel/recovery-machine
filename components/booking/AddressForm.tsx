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
import { useEffect, useRef, useState } from "react";
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
  }, [googleMapsLoaded]);

  const handlePlaceSelected = () => {
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
  };

  const calculateSetupFee = async (addressData: Address) => {
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
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Where should we set up?</h2>
        <p className="text-gray-600">We'll bring the recovery experience right to your location</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Google Places Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="autocomplete-address">Search Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Start typing your address..."
              className="pl-10"
              onChange={(e) => {
                setValue("street", e.target.value, { shouldValidate: true });
              }}
            />
          </div>
          <p className="text-sm text-gray-500">Start typing to see address suggestions</p>
        </div>

        {/* Manual address fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input {...register("street")} id="street" placeholder="123 Main St" />
            {errors.street && <p className="text-sm text-red-600">{errors.street.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input {...register("city")} id="city" placeholder="Los Angeles" />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input {...register("state")} id="state" placeholder="CA" maxLength={2} />
            {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              {...register("zipCode")}
              id="zipCode"
              placeholder="90210"
              maxLength={10}
              onChange={(e) => {
                setValue("zipCode", e.target.value, { shouldValidate: true });
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
          <Card>
            <CardContent className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Calculating setup fee...</span>
            </CardContent>
          </Card>
        )}

        {setupFee && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Setup Fee Calculation</span>
              </CardTitle>
              <CardDescription>One-time fee for equipment delivery and setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Base setup fee:</span>
                    <span className="font-medium">{formatPrice(setupFee.baseSetupFee)}</span>
                  </div>
                  {setupFee.distanceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Distance fee:</span>
                      <span className="font-medium">{formatPrice(setupFee.distanceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total setup fee:</span>
                    <span className="font-semibold text-lg">
                      {formatPrice(setupFee.totalSetupFee)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Distance: {setupFee.distance} miles
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Est. travel time: {setupFee.estimatedTravelTime} min
                    </span>
                  </div>
                </div>
              </div>

              {setupFee.totalSetupFee >= 40000 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This location has a higher setup fee due to distance. Consider choosing a
                    location closer to our service area to reduce costs.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service area info */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Service Area</h3>
                <p className="text-sm text-green-700">
                  We currently serve Los Angeles County and surrounding areas. Setup fees vary based
                  on distance from our facility.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Beverly Hills
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Santa Monica
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    West Hollywood
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Manhattan Beach
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
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
