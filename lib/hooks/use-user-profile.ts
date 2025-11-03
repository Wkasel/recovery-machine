import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  phone: string | null;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    formatted?: string;
  } | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface SavedAddress {
  id?: string;
  label: string; // "Home", "Office", "Beach House"
  street: string;
  city: string;
  state: string;
  zip: string;
  formatted: string;
  is_default?: boolean;
}

/**
 * Hook to fetch and manage user profile data
 * Includes address management for booking flow optimization
 */
export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createBrowserSupabaseClient();

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError(profileError.message);
          return;
        }

        setProfile(profileData);

        // Parse saved addresses from profile.address JSONB
        // Structure: { default: {...}, saved: [{label, ...}, ...] }
        if (profileData?.address) {
          const addresses: SavedAddress[] = [];

          // Add default address if exists
          if (profileData.address.street) {
            addresses.push({
              label: "Default Address",
              street: profileData.address.street || "",
              city: profileData.address.city || "",
              state: profileData.address.state || "",
              zip: profileData.address.zip || "",
              formatted: profileData.address.formatted || "",
              is_default: true,
            });
          }

          // Add any additional saved addresses
          if (Array.isArray(profileData.address.saved)) {
            addresses.push(...profileData.address.saved);
          }

          setSavedAddresses(addresses);
        }
      } catch (err) {
        console.error("Error in useUserProfile:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  /**
   * Save a new address to user profile
   */
  const saveAddress = async (address: SavedAddress, makeDefault = false) => {
    if (!user || !profile) return;

    try {
      const supabase = createClient();

      let updatedAddress = profile.address || {};

      if (makeDefault) {
        // Set as default address
        updatedAddress = {
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          formatted: address.formatted,
          saved: updatedAddress.saved || [],
        };
      } else {
        // Add to saved addresses list
        const saved = Array.isArray(updatedAddress.saved)
          ? updatedAddress.saved
          : [];

        saved.push({
          label: address.label,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          formatted: address.formatted,
        });

        updatedAddress = {
          ...updatedAddress,
          saved,
        };
      }

      const { error } = await supabase
        .from("profiles")
        .update({ address: updatedAddress })
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile
      setProfile({ ...profile, address: updatedAddress });

      // Update saved addresses list
      const addresses: SavedAddress[] = [];
      if (updatedAddress.street) {
        addresses.push({
          label: "Default Address",
          street: updatedAddress.street,
          city: updatedAddress.city,
          state: updatedAddress.state,
          zip: updatedAddress.zip,
          formatted: updatedAddress.formatted,
          is_default: true,
        });
      }
      if (Array.isArray(updatedAddress.saved)) {
        addresses.push(...updatedAddress.saved);
      }
      setSavedAddresses(addresses);

    } catch (err) {
      console.error("Error saving address:", err);
      throw err;
    }
  };

  return {
    profile,
    savedAddresses,
    loading,
    error,
    saveAddress,
  };
}
