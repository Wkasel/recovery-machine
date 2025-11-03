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
import { SavedAddress, UserProfile } from "@/lib/hooks/use-user-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Clock, DollarSign, Loader2, MapPin, Home } from "lucide-react";
import { useEffect, useId, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

interface AddressFormProps {
  address?: Address;
  onAddressChange: (address: Address) => void;
  onSetupFeeCalculated: (setupFee: SetupFeeCalculation) => void;
  onNext: () => void;
  onBack: () => void;
  savedAddresses?: SavedAddress[];
  profile?: UserProfile | null;
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
  savedAddresses = [],
  profile,
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

    // Update the autocomplete input value to show the selected address
    if (inputRef.current && place.formatted_address) {
      inputRef.current.value = place.formatted_address;
    }

    // Update form values with shouldDirty to mark fields as touched
    Object.entries(addressData).forEach(([key, value]) => {
      if (value) {
        setValue(key as keyof Address, value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    });

    // Manually trigger validation after all fields are set
    trigger().then(() => {
      // Calculate setup fee after validation
      calculateSetupFee(addressData);
    });
  }, [setValue, trigger, calculateSetupFee]);

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

  const handleSavedAddressSelect = useCallback((savedAddress: SavedAddress) => {
    const addressData: Address = {
      street: savedAddress.street,
      city: savedAddress.city,
      state: savedAddress.state,
      zipCode: savedAddress.zip,
    };

    // Update form values
    Object.entries(addressData).forEach(([key, value]) => {
      if (value) {
        setValue(key as keyof Address, value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    });

    // Update autocomplete input display
    if (inputRef.current) {
      inputRef.current.value = savedAddress.formatted;
    }

    // Trigger validation and calculate setup fee
    trigger().then(() => {
      calculateSetupFee(addressData);
    });
  }, [setValue, trigger, calculateSetupFee]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Where should we set up?</h2>
        <p className="text-muted-foreground font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>We'll bring the recovery experience right to your location</p>
      </div>

      {/* Saved Addresses Section */}
      {savedAddresses.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground text-lg" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              <Home className="w-5 h-5" />
              <span>Your Saved Addresses</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Select a previously used address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedAddresses.map((saved, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                onClick={() => handleSavedAddressSelect(saved)}
                className="w-full justify-start text-left h-auto py-3 px-4 rounded-2xl hover:bg-mint-accent/10 hover:border-mint-accent transition-colors"
              >
                <div className="flex items-start space-x-3 w-full">
                  <MapPin className="w-4 h-4 mt-0.5 text-mint-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {saved.label}
                      {saved.is_default && (
                        <Badge variant="secondary" className="bg-mint-accent/20 text-charcoal text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {saved.formatted || `${saved.street}, ${saved.city}, ${saved.state} ${saved.zip}`}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20 md:pb-6">
        {savedAddresses.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-light">Or enter a new address</span>
            </div>
          </div>
        )}

        {/* Google Places Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="autocomplete-address" className="text-foreground">Search Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Start typing your address..."
              className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-mint focus:ring-mint"
            />
          </div>
          <p className="text-sm text-muted-foreground font-light">Start typing to see address suggestions</p>
        </div>

        {/* Manual address fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={streetId} className="text-foreground">Street Address *</Label>
            <Input
              id={streetId}
              name="street"
              value={watchedAddress.street || ""}
              placeholder="123 Main St"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[44px] focus:border-mint focus:ring-mint"
              onChange={async (e) => {
                setValue("street", e.target.value, { shouldValidate: true, shouldDirty: true });
                await trigger();
              }}
            />
            {errors.street && <p className="text-sm text-red-600">{errors.street.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={cityId} className="text-foreground">City *</Label>
            <Input
              id={cityId}
              name="city"
              value={watchedAddress.city || ""}
              placeholder="Orange County / Los Angeles"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[44px] focus:border-mint focus:ring-mint"
              onChange={async (e) => {
                setValue("city", e.target.value, { shouldValidate: true, shouldDirty: true });
                await trigger();
              }}
            />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={stateId} className="text-foreground">State *</Label>
            <Input
              id={stateId}
              name="state"
              value={watchedAddress.state || ""}
              placeholder="CA"
              maxLength={2}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[44px] focus:border-mint focus:ring-mint"
              onChange={async (e) => {
                setValue("state", e.target.value, { shouldValidate: true, shouldDirty: true });
                await trigger();
              }}
            />
            {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={zipId} className="text-foreground">ZIP Code *</Label>
            <Input
              id={zipId}
              name="zipCode"
              value={watchedAddress.zipCode || ""}
              placeholder="90210"
              maxLength={10}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[44px] focus:border-mint focus:ring-mint"
              onChange={async (e) => {
                setValue("zipCode", e.target.value, { shouldValidate: true, shouldDirty: true });
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
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardContent className="flex items-center justify-center py-6 text-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Calculating setup fee...</span>
            </CardContent>
          </Card>
        )}

        {setupFee && (
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                <DollarSign className="w-5 h-5 text-foreground" />
                <span>Setup Fee Calculation</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>One-time fee for equipment delivery and setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground font-light">Base setup fee:</span>
                    <span className="font-medium text-foreground">{formatPrice(setupFee.baseSetupFee)}</span>
                  </div>
                  {setupFee.distanceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground font-light">Distance fee:</span>
                      <span className="font-medium text-foreground">{formatPrice(setupFee.distanceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-foreground">Total setup fee:</span>
                    <span className="font-semibold text-lg text-foreground">
                      {formatPrice(setupFee.totalSetupFee)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-foreground" />
                    <span className="text-sm text-muted-foreground font-light">
                      Distance: {setupFee.distance} miles
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-foreground" />
                    <span className="text-sm text-muted-foreground font-light">
                      Est. travel time: {setupFee.estimatedTravelTime} min
                    </span>
                  </div>
                </div>
              </div>

              {setupFee.totalSetupFee >= 40000 && (
                <Alert className="bg-white border-border">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-foreground font-light">
                    This location has a higher setup fee due to distance. Consider choosing a
                    location closer to our service area to reduce costs.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service area info */}
        <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
          <CardContent className="py-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Service Area</h3>
                <p className="text-sm text-muted-foreground font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                  Based in Orange County, we proudly serve all of Southern California. Setup fees vary based
                  on distance from our facility.
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-mint-accent/20 text-charcoal border border-mint-accent font-medium" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                    Serving All of Southern California
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Mobile Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 min-h-[48px] rounded-full">
              Back to Service
            </Button>
            <Button type="submit" disabled={!isValid || !setupFee} variant="ghost" className="flex-1 min-h-[48px] rounded-full !bg-charcoal !text-white hover:!bg-charcoal/90">
              Continue to Calendar
            </Button>
          </div>
        </div>

        {/* Desktop Navigation buttons */}
        <div className="hidden md:flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack} size="lg" className="rounded-full">
            Back to Service
          </Button>

          <Button type="submit" disabled={!isValid || !setupFee} size="lg" variant="ghost" className="px-8 rounded-full !bg-charcoal !text-white hover:!bg-charcoal/90 hover:scale-105 transition-transform">
            Continue to Calendar
          </Button>
        </div>
      </form>
    </div>
  );
}
