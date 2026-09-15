import { MessageCircle } from "lucide-react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const url = getWhatsAppUrl(
    "Hi! I'd like to know more about your pieces."
  );

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={26} strokeWidth={1.8} />
    </a>
  );
}
