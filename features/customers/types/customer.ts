export type CustomerStatus =
  | "active"
  | "inactive"
  | "blocked";

export interface Customer {
  id: string;
  auth_user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}