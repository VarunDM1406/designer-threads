"use server";

import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirmPassword"));

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Account created successfully. Check your email if confirmation is enabled.",
  };
}