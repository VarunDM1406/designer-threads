export function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
    }
  ).format(value);
}
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(
  date: string
) {
  const parsed = new Date(date);

  return `${parsed.getUTCDate()} ${SHORT_MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
}