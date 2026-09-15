export interface WishlistItem {
  id: string;
  slug: string;

  name: string;
  price: number;
  compareAtPrice?: number | null;

  image?: string | null;

  addedAt: string;
}
