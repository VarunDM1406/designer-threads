"use client";

import { useState } from "react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !message.trim()) {
      setError("Please share your name and a short message.");
      return;
    }

    const composed = [
      `Hi, I'm ${name.trim()}.`,
      email.trim() ? `Email: ${email.trim()}` : null,
      "",
      message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    const url = getWhatsAppUrl(composed);

    if (!url) {
      setError(
        "Direct messaging isn't set up yet — please use one of the channels alongside this form."
      );
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
          Name
        </label>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          placeholder="Your name"
          className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
          Email (optional)
        </label>

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
          Message
        </label>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          placeholder="How can we help?"
          className="mt-2 w-full resize-none border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
        />
      </div>

      {error && (
        <p className="text-[13px] text-[#b42318]">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-[#103f35] py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
      >
        Send via WhatsApp
      </button>
    </form>
  );
}
