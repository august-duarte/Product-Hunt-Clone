import sql from '@/lib/db';
import type { Product } from '@/types/product';

export const createProduct = async (
  name: string,
  slug: string,
  tagline: string,
  description: string | null,
  url: string,
  userId: number,
): Promise<Product> => {
  const [product] = await sql`
    INSERT INTO products (name, slug, tagline, description, url, user_id)
    VALUES (${name}, ${slug}, ${tagline}, ${description}, ${url}, ${userId})
    RETURNING id, name, slug, tagline, description, url, user_id, created_at
  `;
  return product as Product;
};

export const getProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  const [product] = await sql`
    SELECT id, name, slug, tagline, description, url, user_id, created_at
    FROM products
    WHERE slug = ${slug}
  `;
  return product as Product | undefined;
};

export const listProductsForToday = async (): Promise<Product[]> => {
  const products = await sql`
    SELECT id, name, slug, tagline, description, url, user_id, created_at
    FROM products
    WHERE created_at >= CURRENT_DATE
      AND created_at < CURRENT_DATE + INTERVAL '1 day'
    ORDER BY created_at DESC
  `;
  // Later: join upvotes and sort by upvote count, then created_at:
  // ORDER BY upvote_count DESC, created_at DESC
  return products as Product[];
};
