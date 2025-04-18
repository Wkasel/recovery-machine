import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/core/actions/server/auth/user-profile";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/core/schemas/server/profile";
import { useLoading } from "@/lib/ui/loading/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ProfileForm() {
  const router = useRouter();
  const { setLoading, isLoading } = useLoading();

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: "",
      avatar_url: "",
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setLoading("update-profile", true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await updateProfile(formData);
      if (result.success) {
        toast.success(result.message || "Profile updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading("update-profile", false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          {...form.register("full_name")}
          className={form.formState.errors.full_name ? "border-red-500" : ""}
        />
        {form.formState.errors.full_name && (
          <p className="text-red-500 text-sm">{form.formState.errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          {...form.register("avatar_url")}
          className={form.formState.errors.avatar_url ? "border-red-500" : ""}
        />
        {form.formState.errors.avatar_url && (
          <p className="text-red-500 text-sm">{form.formState.errors.avatar_url.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading("update-profile")}>
        {isLoading("update-profile") ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
