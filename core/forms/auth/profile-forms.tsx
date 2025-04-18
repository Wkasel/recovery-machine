"use client";

import { FormBuilder } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEmail, updatePassword } from "@/core/actions/server/auth/user/profile";
import { clientAuthSchemas } from "@/core/schemas/client/auth";
import { User } from "@supabase/supabase-js";

export interface ProfileFormsProps {
  user: User;
}

export function UpdateEmailForm({ user }: ProfileFormsProps) {
  return (
    <FormBuilder
      title="Update Email"
      schema={clientAuthSchemas.profile.updateEmail}
      action={updateEmail}
      formId="update-email-form"
      submitText="Update Email"
      toastMessages={{
        success: "Email update confirmation sent. Please check your email.",
        error: "Failed to update email",
      }}
      defaultValues={{
        email: user?.email || "",
      }}
    >
      {(form) => (
        <div className="space-y-2">
          <Label htmlFor="email">New Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter new email"
            required
            autoComplete="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email?.message && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message?.toString() || "Invalid email"}
            </p>
          )}
          {/* We need confirmEmail field from client schema */}
          <Label htmlFor="confirmEmail">Confirm New Email</Label>
          <Input
            id="confirmEmail"
            type="email"
            placeholder="Confirm new email"
            required
            autoComplete="email"
            {...form.register("confirmEmail")}
            aria-invalid={!!form.formState.errors.confirmEmail}
          />
          {form.formState.errors.confirmEmail?.message && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.confirmEmail.message?.toString() || "Emails don't match"}
            </p>
          )}
        </div>
      )}
    </FormBuilder>
  );
}

export function UpdatePasswordForm() {
  return (
    <FormBuilder
      title="Change Password"
      schema={clientAuthSchemas.profile.updatePassword}
      action={updatePassword}
      formId="update-password-form"
      submitText="Update Password"
      toastMessages={{
        success: "Password updated successfully",
        error: "Failed to update password",
      }}
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              required
              autoComplete="current-password"
              {...form.register("currentPassword")}
              aria-invalid={!!form.formState.errors.currentPassword}
            />
            {form.formState.errors.currentPassword?.message && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.currentPassword.message?.toString() || "Invalid password"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password (min. 8 characters)"
              required
              minLength={8}
              autoComplete="new-password"
              {...form.register("newPassword")}
              aria-invalid={!!form.formState.errors.newPassword}
            />
            {form.formState.errors.newPassword?.message && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.newPassword.message?.toString() || "Invalid password"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              required
              minLength={8}
              autoComplete="new-password"
              {...form.register("confirmPassword")}
              aria-invalid={!!form.formState.errors.confirmPassword}
            />
            {form.formState.errors.confirmPassword?.message && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.confirmPassword.message?.toString() ||
                  "Passwords don't match"}
              </p>
            )}
          </div>
        </>
      )}
    </FormBuilder>
  );
}

export function ProfileForms({ user }: ProfileFormsProps) {
  return (
    <>
      <UpdateEmailForm user={user} />
      <UpdatePasswordForm />
    </>
  );
}

export default ProfileForms;
