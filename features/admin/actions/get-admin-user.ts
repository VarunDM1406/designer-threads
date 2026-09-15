"use server";

import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "../types/admin";

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("auth_user_id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "admin" ||
    profile.is_active === false
  ) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    first_name:
      user.user_metadata?.first_name ??
      user.user_metadata?.firstName ??
      null,
    last_name:
      user.user_metadata?.last_name ??
      user.user_metadata?.lastName ??
      null,
    role: profile.role,
  };
}