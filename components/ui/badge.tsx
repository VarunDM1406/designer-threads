import { cn } from "@/lib/utils";

type Variant =
  | "success"
  | "warning"
  | "danger"
  | "default";

const variants = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  default: "bg-neutral-100 text-neutral-700",
};

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}