"use server";

import { createClient } from "@/lib/supabase/server";
import { resetPasswordSchema } from "../schemas/auth.schema";

export async function resetPassword(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input.",
    };
  }

  const supabase = await createClient();

  // Requires an active recovery session, established by following a
  // valid reset-password email link through /auth/confirm.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message:
        "This reset link has expired or already been used. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Password updated. You can now sign in.",
  };
}
