"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const data = updateProfileSchema.parse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("profiles").update(data).eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: "Profile updated successfully!" };
}
