export type BannerPosition =
  | "hero"
  | "announcement"
  | "collection"
  | "promotion";

export interface Banner {
  id: string;

  title: string | null;
  subtitle: string | null;

  button_text: string | null;
  button_link: string | null;

  image_url: string | null;
  mobile_image_url: string | null;
  background_color: string | null;

  position: BannerPosition;
  display_order: number;

  is_active: boolean;

  starts_at: string | null;
  ends_at: string | null;

  created_at: string;
  updated_at: string;
}