import Card from "./card";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-500">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {value}
        </h2>

        <p className="mt-2 text-sm text-emerald-600">
          {change}
        </p>
      </div>

      <div className="rounded-2xl bg-neutral-100 p-4">
        <Icon size={28} />
      </div>
    </Card>
  );
}