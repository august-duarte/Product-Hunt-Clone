import sql from '@/lib/db';
import type { Product, ProductWithUpvoteCount } from '@/types/product';

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

export const getProductById = async (
  id: number,
): Promise<ProductWithUpvoteCount | undefined> => {
  const [product] = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.user_id,
      p.created_at,
      COALESCE(COUNT(u.id), 0)::int AS upvote_count
    FROM products p
    LEFT JOIN upvotes u ON u.product_id = p.id
    WHERE p.id = ${id}
    GROUP BY p.id
  `;
  return product as ProductWithUpvoteCount | undefined;
};

export const listProducts = async (): Promise<ProductWithUpvoteCount[]> => {
  const products = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.user_id,
      p.created_at,
      COALESCE(COUNT(u.id), 0)::int AS upvote_count
    FROM products p
    LEFT JOIN upvotes u ON u.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
  return products as ProductWithUpvoteCount[];
};

export const listProductsForToday = async (): Promise<ProductWithUpvoteCount[]> => {
  const products = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.user_id,
      p.created_at,
      COALESCE(COUNT(u.id), 0)::int AS upvote_count
    FROM products p
    LEFT JOIN upvotes u ON u.product_id = p.id
    WHERE p.created_at >= CURRENT_DATE
      AND p.created_at < CURRENT_DATE + INTERVAL '1 day'
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
  return products as ProductWithUpvoteCount[];
};
