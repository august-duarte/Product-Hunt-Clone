import sql from '@/lib/db';
import { buildProductLogoUrl } from '@/lib/utils/product-logo';
import { listTagsForProduct, listTagsForProducts } from '@/lib/queries/tags';
import { getUpvotedProductIds } from '@/lib/queries/upvotes';
import type {
  PaginatedProducts,
  PaginationOptions,
  Product,
  ProductDetailItem,
  ProductListItem,
  ProductWithUpvoteCount,
} from '@/types/product';

export const PRODUCTS_PAGE_SIZE = 20;

type ProductListRow = Omit<ProductListItem, 'tags' | 'user_has_upvoted'>;

type ProductListFilters = {
  todayOnly?: boolean;
  makerUserId?: number;
  searchPattern?: string;
  tagId?: number;
  tagSlug?: string;
};

function normalizePagination(options: PaginationOptions = {}) {
  const pageSize = Math.max(1, options.pageSize ?? PRODUCTS_PAGE_SIZE);
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
}

async function withProductTags(
  products: ProductListRow[],
): Promise<Omit<ProductListItem, 'user_has_upvoted'>[]> {
  const tagsByProductId = await listTagsForProducts(
    products.map((product) => product.id),
  );

  return products.map((product) => ({
    ...product,
    tags: tagsByProductId.get(product.id) ?? [],
  }));
}

export async function withUserUpvoteState(
  products: Omit<ProductListItem, 'user_has_upvoted'>[],
  userId: number | null,
): Promise<ProductListItem[]> {
  if (!userId || products.length === 0) {
    return products.map((product) => ({
      ...product,
      user_has_upvoted: false,
    }));
  }

  const upvotedIds = await getUpvotedProductIds(
    userId,
    products.map((product) => product.id),
  );

  return products.map((product) => ({
    ...product,
    user_has_upvoted: upvotedIds.has(product.id),
  }));
}

async function queryProductList(
  filters: ProductListFilters = {},
  options: PaginationOptions = {},
): Promise<{ rows: ProductListRow[]; total: number }> {
  const { todayOnly, makerUserId, searchPattern, tagId, tagSlug } = filters;
  const { pageSize, offset } = normalizePagination(options);

  const tagJoin =
    tagId != null
      ? sql`INNER JOIN product_tags pt ON pt.product_id = p.id`
      : tagSlug != null
        ? sql`
            INNER JOIN product_tags pt ON pt.product_id = p.id
            INNER JOIN tags t ON t.id = pt.tag_id
          `
        : sql``;

  const whereClause = sql`
    WHERE 1=1
      ${
        todayOnly
          ? sql`AND p.created_at >= CURRENT_DATE
               AND p.created_at < CURRENT_DATE + INTERVAL '1 day'`
          : sql``
      }
      ${makerUserId != null ? sql`AND p.user_id = ${makerUserId}` : sql``}
      ${
        searchPattern
          ? sql`AND (
              p.name ILIKE ${searchPattern}
              OR p.tagline ILIKE ${searchPattern}
              OR p.description ILIKE ${searchPattern}
              OR maker.name ILIKE ${searchPattern}
            )`
          : sql``
      }
      ${tagId != null ? sql`AND pt.tag_id = ${tagId}` : sql``}
      ${tagSlug != null ? sql`AND t.slug = ${tagSlug}` : sql``}
  `;

  const [countResult] = await sql`
    SELECT COUNT(DISTINCT p.id)::int AS total
    FROM products p
    ${tagJoin}
    LEFT JOIN users maker ON maker.id = p.user_id
    ${whereClause}
  `;

  const rows = await sql`
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
    ${tagJoin}
    LEFT JOIN users maker ON maker.id = p.user_id
    LEFT JOIN upvotes uv ON uv.product_id = p.id
    LEFT JOIN comments c ON c.product_id = p.id
    ${whereClause}
    GROUP BY p.id, maker.name, maker.username
    ORDER BY upvote_count DESC, p.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  return {
    rows: rows as ProductListRow[],
    total: Number(countResult?.total ?? 0),
  };
}

async function listProductsWithFilters(
  filters: ProductListFilters,
  options: PaginationOptions = {},
): Promise<PaginatedProducts> {
  const { page, pageSize } = normalizePagination(options);
  const { rows, total } = await queryProductList(filters, options);
  const products = await withProductTags(rows);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    products: products.map((product) => ({
      ...product,
      user_has_upvoted: false,
    })),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export const createProduct = async (
  name: string,
  slug: string,
  tagline: string,
  description: string | null,
  url: string,
  userId: number,
  logoUrl?: string | null,
): Promise<Product> => {
  const resolvedLogoUrl = logoUrl?.trim() || buildProductLogoUrl(name);
  const [product] = await sql`
    INSERT INTO products (name, slug, tagline, description, url, logo_url, user_id)
    VALUES (${name}, ${slug}, ${tagline}, ${description}, ${url}, ${resolvedLogoUrl}, ${userId})
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
  return {
    ...(product as ProductListRow),
    tags,
    user_has_upvoted: false,
  };
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
    DELETE FROM comments WHERE product_id = ${id}
  `;
  await sql`
    DELETE FROM upvotes WHERE product_id = ${id}
  `;
  await sql`
    DELETE FROM product_tags WHERE product_id = ${id}
  `;

  const deleted = await sql`
    DELETE FROM products WHERE id = ${id}
    RETURNING id
  `;

  return deleted.length > 0;
};

export const listProducts = async (
  options: PaginationOptions = {},
): Promise<PaginatedProducts> => listProductsWithFilters({}, options);

export const listProductsForToday = async (
  options: PaginationOptions = {},
): Promise<PaginatedProducts> =>
  listProductsWithFilters({ todayOnly: true }, options);

export const listProductsByUserId = async (
  userId: number,
  options: PaginationOptions = {},
): Promise<PaginatedProducts> =>
  listProductsWithFilters({ makerUserId: userId }, options);

export const searchProducts = async (
  query: string,
  options: PaginationOptions = {},
): Promise<PaginatedProducts> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    const { page, pageSize } = normalizePagination(options);
    return {
      products: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }

  return listProductsWithFilters(
    { searchPattern: `%${trimmedQuery}%` },
    options,
  );
};

export const listProductsByTagId = async (
  tagId: number,
  options: PaginationOptions = {},
): Promise<PaginatedProducts> =>
  listProductsWithFilters({ tagId }, options);

export const listProductsByTagSlug = async (
  tagSlug: string,
  todayOnly = false,
  options: PaginationOptions = {},
): Promise<PaginatedProducts> =>
  listProductsWithFilters({ tagSlug, todayOnly }, options);
