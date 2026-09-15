import { cn } from "@/lib/utils";

export function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <thead className="bg-neutral-50">
      {children}
    </thead>
  );
}

export function TableBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tbody>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-neutral-100 transition hover:bg-neutral-50">
      {children}
    </tr>
  );
}

export function TableHeaderCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-6 py-4 text-sm text-neutral-700",
        className
      )}
    >
      {children}
    </td>
  );
}