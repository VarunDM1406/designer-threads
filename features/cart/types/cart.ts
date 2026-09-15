export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;

  name: string;
  sku?: string | null;

  price: number;
  quantity: number;

  image?: string | null;

  size?: string | null;
  color?: string | null;
}