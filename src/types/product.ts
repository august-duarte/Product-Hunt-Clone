export type Product = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string | null;
  url: string;
  user_id: number;
  created_at: Date | string;
};
