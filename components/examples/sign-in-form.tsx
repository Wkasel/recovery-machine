"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useZodForm } from "@/lib/forms/hooks/use-zod-form";
import { clientAuthSchemas } from "@/lib/schemas";
import { createDomainLoading } from "@/lib/ui/loading/context";
import { FormSkeleton } from "@/lib/ui/loading/skeletons";
import { useRouter } from "next/navigation";

// Create a domain-specific loading hook
const useAuthLoading = createDomainLoading("auth");

// This is a mock server action - replace with your actual server action
async function signInAction(formData: FormData) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get form data
  const email = formData.get("email") as string;

  // Mock validation - in a real app, this happens on the server
  if (email === "error@example.com") {
    return { success: false, error: "Invalid email or password" };
  }

  return { success: true };
}

/**
 * Example sign-in form component that demonstrates:
 * - React Hook Form integration with Zod validation
 * - Loading state management
 * - Toast notifications
 * - Error handling
 */
export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading } = useAuthLoading();

  // Form with Zod validation
  const { form, isPending, onSubmit } = useZodForm({
    schema: clientAuthSchemas.emailPassword.signIn,
    action: signInAction,
    options: {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully signed in",
        });
        router.push("/dashboard");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      },
    },
  });

  // Show skeleton while the form is initially loading (e.g., during SSR/hydration)
  if (isLoading("form-loading")) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          {...form.register("email")}
          className={form.formState.errors.email ? "border-red-500" : ""}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          {...form.register("password")}
          className={form.formState.errors.password ? "border-red-500" : ""}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
