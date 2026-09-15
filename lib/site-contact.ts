import { getWhatsAppUrl } from "./whatsapp";

export function getSiteContact() {
  return {
    whatsappUrl: getWhatsAppUrl(
      "Hi! I'd like to get in touch with Designer Threads."
    ),
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || null,
    address: process.env.NEXT_PUBLIC_STORE_ADDRESS?.trim() || null,
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || null,
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || null,
  };
}
