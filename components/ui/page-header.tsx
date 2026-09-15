import Link from "next/link";
import Button from "./button";

type PageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-neutral-500">
            {description}
          </p>
        )}
      </div>

      {actionLabel &&
        (actionHref ? (
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        ) : (
          <Button>{actionLabel}</Button>
        ))}
    </div>
  );
}