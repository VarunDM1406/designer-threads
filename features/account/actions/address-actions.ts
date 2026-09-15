"use server";

import { createClient } from "@/lib/supabase/server";

export type AddressInput = {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  country?: string;
  postal_code: string;
  is_default?: boolean;
};

export async function addAddress(input: AddressInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Customer profile not found.");
  }

  const { data: existingAddresses, error: existingError } =
    await supabase
      .from("addresses")
      .select("id")
      .eq("profile_id", profile.id);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const shouldBeDefault =
    input.is_default === true ||
    !existingAddresses ||
    existingAddresses.length === 0;

  if (shouldBeDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("profile_id", profile.id);
  }

  const { error } = await supabase.from("addresses").insert({
    profile_id: profile.id,
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    address_line_1: input.address_line_1.trim(),
    address_line_2: input.address_line_2?.trim() || null,
    landmark: input.landmark?.trim() || null,
    city: input.city.trim(),
    state: input.state.trim(),
    country: input.country?.trim() || "India",
    postal_code: input.postal_code.trim(),
    is_default: shouldBeDefault,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new Error("Customer profile not found.");
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new Error("Customer profile not found.");
  }

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("profile_id", profile.id);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}
export async function updateAddress(
  addressId: string,
  input: AddressInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new Error("Customer profile not found.");
  }

  // Make sure this address belongs to this customer
  const { data: existingAddress, error: existingError } =
    await supabase
      .from("addresses")
      .select("id, is_default")
      .eq("id", addressId)
      .eq("profile_id", profile.id)
      .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existingAddress) {
    throw new Error("Address not found.");
  }

  const shouldBeDefault =
    input.is_default === true ||
    existingAddress.is_default === true;

  if (shouldBeDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("profile_id", profile.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      full_name: input.full_name.trim(),
      phone: input.phone.trim(),
      address_line_1: input.address_line_1.trim(),
      address_line_2:
        input.address_line_2?.trim() || null,
      landmark:
        input.landmark?.trim() || null,
      city: input.city.trim(),
      state: input.state.trim(),
      country:
        input.country?.trim() || "India",
      postal_code: input.postal_code.trim(),
      is_default: shouldBeDefault,
    })
    .eq("id", addressId)
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}