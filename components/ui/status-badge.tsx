type Props = {
  status: "active" | "draft" | "archived";
};

export default function StatusBadge({
  status,
}: Props) {
  const styles = {
    active:
      "bg-green-100 text-green-700",

    draft:
      "bg-yellow-100 text-yellow-700",

    archived:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}