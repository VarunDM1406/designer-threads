import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white hover:bg-neutral-800 focus:ring-black",

  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-300",

  outline:
    "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-300",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}