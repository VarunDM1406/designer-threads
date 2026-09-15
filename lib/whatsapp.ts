const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();

export function getWhatsAppNumber(): string | null {
  if (!RAW_NUMBER) return null;

  const digitsOnly = RAW_NUMBER.replace(/[^\d]/g, "");

  return digitsOnly.length > 0 ? digitsOnly : null;
}

export function getWhatsAppUrl(message?: string): string | null {
  const number = getWhatsAppNumber();

  if (!number) return null;

  const base = `https://wa.me/${number}`;

  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

type OrderWhatsAppItem = {
  name: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
};

type OrderWhatsAppDetails = {
  orderNumber: string;
  items: OrderWhatsAppItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string | null;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

function formatInr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

export function buildOrderWhatsAppMessage(
  order: OrderWhatsAppDetails
): string {
  const lines: string[] = [];

  lines.push(`New order ${order.orderNumber}`);
  lines.push("");

  for (const item of order.items) {
    const variant = [item.size, item.color]
      .filter(Boolean)
      .join(" / ");

    lines.push(
      `- ${item.name}${variant ? ` (${variant})` : ""} x${item.quantity} — ${formatInr(item.unitPrice * item.quantity)}`
    );
  }

  lines.push("");
  lines.push(`Subtotal: ${formatInr(order.subtotal)}`);
  lines.push(
    `Shipping: ${order.shipping === 0 ? "Free" : formatInr(order.shipping)}`
  );

  if (order.discount && order.discount > 0) {
    lines.push(`Discount: -${formatInr(order.discount)}`);

    if (order.couponCode) {
      lines.push(`Coupon Code: ${order.couponCode}`);
    }
  }

  lines.push(`Total: ${formatInr(order.total)}`);
  lines.push("");
  lines.push(`Name: ${order.customerName}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push(
    `Delivery Address: ${order.address}, ${order.city}, ${order.state} - ${order.postalCode}`
  );
  lines.push("");
  lines.push("Please confirm my order. Thank you!");

  return lines.join("\n");
}
