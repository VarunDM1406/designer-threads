import Button from "./button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-24">
      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-center text-neutral-500">
        {description}
      </p>

      {actionLabel && (
        <Button className="mt-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}