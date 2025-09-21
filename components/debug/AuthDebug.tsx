"use client";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function AuthDebug() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserSupabaseClient();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const checkAuth = async () => {
    try {
      // Check user auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      setUser(user);

      if (authError) {
        setError(`Auth Error: ${authError.message}`);
        return;
      }

      if (user) {
        // Check admin status
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("*")
          .eq("email", user.email)
          .single();

        setAdminData(adminData);
        setIsAdmin(!!adminData?.is_active);

        if (adminError) {
          setError(`Admin Check Error: ${adminError.message}`);
        }
      }
    } catch (err) {
      setError(`Unexpected Error: ${err}`);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[40] bg-blue-900 p-4 rounded text-white text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-2">
        <div>User: {user ? user.email : "Not logged in"}</div>
        <div>Admin: {isAdmin === null ? "Checking..." : isAdmin ? "Yes" : "No"}</div>
        {adminData && (
          <div>Role: {adminData.role} | Active: {adminData.is_active ? "Yes" : "No"}</div>
        )}
        {error && <div className="text-red-300">Error: {error}</div>}
        <Button size="sm" onClick={checkAuth} className="mt-2">
          Refresh
        </Button>
      </div>
    </div>
  );
}
