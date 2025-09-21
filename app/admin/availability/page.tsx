import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";

export default async function AvailabilityPage() {
  const supabase = await createServerSupabaseClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/sign-in?redirect=/admin/availability");
  }

  // Check admin access
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("role")
    .eq("email", user.email)
    .single();
    
  if (adminError || !adminData) {
    redirect("/profile");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Availability Management</h1>
        <p className="mt-2 text-gray-400">
          Manage booking availability slots and schedules
        </p>
      </div>

      <AvailabilityManager />
    </div>
  );
}