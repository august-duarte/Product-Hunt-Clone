import type { Tag } from '@/types/tag';

export type Product = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string | null;
  url: string;
  logo_url: string | null;
  user_id: number;
  created_at: Date | string;
};

export type ProductWithUpvoteCount = Product & {
  upvote_count: number;
};

export type ProductListItem = ProductWithUpvoteCount & {
  maker_name: string;
  maker_username: string;
  comment_count: number;
  tags: Tag[];
};

export type ProductDetailItem = ProductListItem;

export type UpdateProductInput = {
  name?: string;
  slug?: string;
  tagline?: string;
  description?: string | null;
  url?: string;
  logo_url?: string | null;
  tags?: string[];
};
