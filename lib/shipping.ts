export function calculateShipping(
  subtotal: number,
  shippingCharge: number,
  freeShippingThreshold: number
): number {
  if (subtotal <= 0) return 0;
  if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) return 0;
  return shippingCharge;
}
