import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForms from "@/core/forms/auth/profile-forms";

export default async function ProfilePage() {
  // Create a Supabase client
  const supabase = await createClient();

  // Get the user - this makes a request to Supabase Auth API to validate the token
  const { data, error } = await supabase.auth.getUser();

  // If no user or error, redirect to login
  if (error || !data?.user) {
    return redirect("/sign-in");
  }

  const user = data.user;

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="text-sm text-muted-foreground">
              <p>User ID: {user.id}</p>
              <p>Current Email: {user.email}</p>
              <p>
                Last Sign In:{" "}
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
              </p>
            </div>
          </div>

          {/* Client-side forms */}
          <ProfileForms user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
