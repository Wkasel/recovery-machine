import { ModuleErrorBoundary } from "@/components/error-boundary";
import { createClient } from "@/core/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
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
    <ModuleErrorBoundary>
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            This is a protected page that you can only see as an authenticated user
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your user details</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </ModuleErrorBoundary>
  );
}
