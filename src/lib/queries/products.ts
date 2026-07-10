import sql from '@/lib/db';
import { buildProductLogoUrl } from '@/lib/utils/product-logo';
import { listTagsForProduct, listTagsForProducts } from '@/lib/queries/tags';
import type {
  Product,
  ProductDetailItem,
  ProductListItem,
  ProductWithUpvoteCount,
} from '@/types/product';

type ProductListRow = Omit<ProductListItem, 'tags'>;

async function withProductTags(
  products: ProductListRow[],
): Promise<ProductListItem[]> {
  const tagsByProductId = await listTagsForProducts(
    products.map((product) => product.id),
  );

  return products.map((product) => ({
    ...product,
    tags: tagsByProductId.get(product.id) ?? [],
  }));
}

export const createProduct = async (
  name: string,
  slug: string,
  tagline: string,
  description: string | null,
  url: string,
  userId: number,
): Promise<Product> => {
  const logoUrl = buildProductLogoUrl(name);
  const [product] = await sql`
    INSERT INTO products (name, slug, tagline, description, url, logo_url, user_id)
    VALUES (${name}, ${slug}, ${tagline}, ${description}, ${url}, ${logoUrl}, ${userId})
    RETURNING id, name, slug, tagline, description, url, logo_url, user_id, created_at
  `;
  return product as Product;
};

export const getProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  const [product] = await sql`
    SELECT id, name, slug, tagline, description, url, logo_url, user_id, created_at
    FROM products
    WHERE slug = ${slug}
  `;
  return product as Product | undefined;
};

export const getProductDetailBySlug = async (
  slug: string,
): Promise<ProductDetailItem | undefined> => {
  const [product] = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    WHERE p.slug = ${slug}
    GROUP BY p.id, maker.name, maker.username
  `;

  if (!product) return undefined;

  const tags = await listTagsForProduct(Number(product.id));
  return { ...(product as ProductListRow), tags };
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
      p.logo_url,
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
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return withProductTags(products as ProductListRow[]);
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
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    WHERE p.created_at >= CURRENT_DATE
      AND p.created_at < CURRENT_DATE + INTERVAL '1 day'
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return withProductTags(products as ProductListRow[]);
};

export const listProductsByUserId = async (
  userId: number,
): Promise<ProductListItem[]> => {
  const products = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    WHERE p.user_id = ${userId}
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return withProductTags(products as ProductListRow[]);
};

export const searchProducts = async (
  query: string,
): Promise<ProductListItem[]> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const pattern = `%${trimmedQuery}%`;
  const products = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    WHERE
      p.name ILIKE ${pattern}
      OR p.tagline ILIKE ${pattern}
      OR p.description ILIKE ${pattern}
      OR maker.name ILIKE ${pattern}
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return withProductTags(products as ProductListRow[]);
};

export const listProductsByTagId = async (
  tagId: number,
): Promise<ProductListItem[]> => {
  const products = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    INNER JOIN product_tags pt ON pt.product_id = p.id
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    WHERE pt.tag_id = ${tagId}
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return withProductTags(products as ProductListRow[]);
};

export const listProductsByTagSlug = async (
  tagSlug: string,
): Promise<ProductListItem[]> => {
  const products = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.tagline,
      p.description,
      p.url,
      p.logo_url,
      p.user_id,
      p.created_at,
      maker.name AS maker_name,
      maker.username AS maker_username,
      COALESCE(COUNT(DISTINCT uv.id), 0)::int AS upvote_count,
      COALESCE(COUNT(DISTINCT c.id), 0)::int AS comment_count
    FROM products p
    INNER JOIN product_tags pt ON pt.product_id = p.id
    INNER JOIN tags t ON t.id = pt.tag_id
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    WHERE t.slug = ${tagSlug}
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
  `;
  return withProductTags(products as ProductListRow[]);
};
