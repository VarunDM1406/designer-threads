"use server";

import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "../schemas/auth.schema";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function forgotPassword(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: String(formData.get("email") || ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid email.",
    };
  }

  const supabase = await createClient();

  // Always report success, even if the email isn't registered — this
  // avoids leaking which addresses have an account.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
  });

  return {
    success: true,
    message:
      "If an account exists for that email, a reset link is on its way.",
  };
}