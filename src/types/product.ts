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

export type ProductWithUpvoteCount = Product & {
  upvote_count: number;
};

export type ProductListItem = ProductWithUpvoteCount & {
  maker_name: string;
};

export type UpdateProductInput = {
  name?: string;
  slug?: string;
  tagline?: string;
  description?: string | null;
  url?: string;
};
