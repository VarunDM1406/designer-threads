import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm",
        "outline-none transition",
        "focus:border-black focus:ring-2 focus:ring-black/10",
        className
      )}
      {...props}
    />
  );
}