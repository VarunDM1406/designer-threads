"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/");

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message || "Unable to sign in.",
    };
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("auth_user_id", data.user.id)
      .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();

    return {
      success: false,
      message:
        "Your account profile could not be found. Please contact support.",
    };
  }

  if (profile.is_active === false) {
    await supabase.auth.signOut();

    return {
      success: false,
      message: "Your account has been deactivated.",
    };
  }

  // Admins always go to the admin dashboard.
  if (profile.role === "admin") {
    redirect("/admin");
  }

  // Signed in with valid credentials via the admin login form, but this
  // account isn't an admin — tell them clearly instead of silently
  // bouncing them back to /admin/login with no explanation.
  if (next === "/admin") {
    await supabase.auth.signOut();

    return {
      success: false,
      message: "This account doesn't have admin access.",
    };
  }

  // Customers return to the page they came from.
  // If there is no destination, go home.
  redirect(next || "/");
}