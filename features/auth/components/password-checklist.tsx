"use client";

import { Check, X } from "lucide-react";

export const passwordRules = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    test: (value: string) => /[0-9]/.test(value),
  },
];

type Props = {
  password: string;
};

export default function PasswordChecklist({ password }: Props) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {passwordRules.map((rule) => {
        const met = rule.test(password);

        return (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 text-[12px] transition-colors ${
              met ? "text-[#0b7a4b]" : "text-[#60716e]"
            }`}
          >
            {met ? (
              <Check size={13} strokeWidth={2} />
            ) : (
              <X size={13} strokeWidth={2} />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
