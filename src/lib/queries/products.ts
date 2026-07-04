import sql from '@/lib/db';
import type {
  Product,
  ProductListItem,
  ProductWithUpvoteCount,
} from '@/types/product';

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

export const updateProduct = async (
  id: number,
  name: string,
  slug: string,
  tagline: string,
  description: string | null,
  url: string,
): Promise<ProductWithUpvoteCount | undefined> => {
  const [product] = await sql`
    UPDATE products
    SET
      name = ${name},
      slug = ${slug},
      tagline = ${tagline},
      description = ${description},
      url = ${url}
    WHERE id = ${id}
    RETURNING id
  `;

  if (!product) return undefined;
  return getProductById(id);
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  await sql`
    DELETE FROM upvotes WHERE product_id = ${id}
  `;

  const deleted = await sql`
    DELETE FROM products WHERE id = ${id}
    RETURNING id
  `;

  return deleted.length > 0;
};

export const listProducts = async (): Promise<ProductListItem[]> => {
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
      maker.name AS maker_name,
      COALESCE(COUNT(uv.id), 0)::int AS upvote_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    GROUP BY p.id, maker.name
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return products as ProductListItem[];
};

export const listProductsForToday = async (): Promise<ProductListItem[]> => {
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
      maker.name AS maker_name,
      COALESCE(COUNT(uv.id), 0)::int AS upvote_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    WHERE p.created_at >= CURRENT_DATE
      AND p.created_at < CURRENT_DATE + INTERVAL '1 day'
    GROUP BY p.id, maker.name
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return products as ProductListItem[];
};
