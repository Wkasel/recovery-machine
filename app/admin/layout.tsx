import { AdminPanelClient } from "@/components/admin/AdminPanelClient";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error("Admin auth error:", authError);
      redirect("/sign-in?redirect=/admin");
    }
    
    if (!user) {
      redirect("/sign-in?redirect=/admin");
    }

    // Check if user is an admin - the table doesn't have is_active column
    console.log("🔍 Checking admin access for user:", {
      userId: user.id,
      userEmail: user.email,
      userEmailConfirmed: user.email_confirmed_at
    });
    
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("role")
      .eq("email", user.email)
      .single();
      
    console.log("🔍 Admin query result:", { adminData, adminError });

    if (adminError) {
      console.error("Admin check error:", adminError);
      // User is not in admins table, redirect to profile
      redirect("/profile");
    }

    if (!adminData) {
      // User is not an admin, redirect to profile
      redirect("/profile");
    }

    // Pass the authenticated user and admin data to the client panel
    return (
      <AdminPanelClient user={user} adminData={adminData}>
        {children}
      </AdminPanelClient>
    );
  } catch (error) {
    console.error("Admin layout error:", error);
    redirect("/sign-in?redirect=/admin");
  }
}
