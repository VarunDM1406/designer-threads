import { getWhatsAppUrl } from "./whatsapp";
import { getSettings } from "@/features/settings/actions/get-settings";

// Admin-editable fields (Settings > Store Settings) take priority over the
// env var fallback, so the site works out of the box but becomes
// admin-controlled the moment someone fills in the Settings page.
export async function getSiteContact() {
  const settings = await getSettings();

  return {
    whatsappUrl: getWhatsAppUrl(
      "Hi! I'd like to get in touch with Designer Threads."
    ),
    email:
      settings.store_email.trim() ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
      null,
    phone:
      settings.store_phone.trim() ||
      process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ||
      null,
    address:
      settings.store_address.trim() ||
      process.env.NEXT_PUBLIC_STORE_ADDRESS?.trim() ||
      null,
    instagramUrl:
      settings.instagram_url.trim() ||
      process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
      null,
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || null,
  };
}
