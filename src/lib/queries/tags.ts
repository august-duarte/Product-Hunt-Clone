import sql from '@/lib/db';
import { slugify } from '@/lib/utils/slug';
import type { Tag } from '@/types/tag';

export const findTagBySlug = async (
  slug: string,
): Promise<Tag | undefined> => {
  const [tag] = await sql`
    SELECT id, name, slug, created_at
    FROM tags
    WHERE slug = ${slug}
  `;
  return tag as Tag | undefined;
};

export const findTagById = async (id: number): Promise<Tag | undefined> => {
  const [tag] = await sql`
    SELECT id, name, slug, created_at
    FROM tags
    WHERE id = ${id}
  `;
  return tag as Tag | undefined;
};

export const listTags = async (): Promise<Tag[]> => {
  const tags = await sql`
    SELECT id, name, slug, created_at
    FROM tags
    ORDER BY name ASC
  `;
  return tags as Tag[];
};

export const listTagsForProduct = async (
  productId: number,
): Promise<Tag[]> => {
  const tags = await sql`
    SELECT t.id, t.name, t.slug, t.created_at
    FROM tags t
    INNER JOIN product_tags pt ON pt.tag_id = t.id
    WHERE pt.product_id = ${productId}
    ORDER BY t.name ASC
  `;
  return tags as Tag[];
};

export const listTagsForProducts = async (
  productIds: number[],
): Promise<Map<number, Tag[]>> => {
  const tagsByProductId = new Map<number, Tag[]>();
  if (productIds.length === 0) return tagsByProductId;

  const rows = await sql`
    SELECT
      pt.product_id,
      t.id,
      t.name,
      t.slug,
      t.created_at
    FROM product_tags pt
    INNER JOIN tags t ON t.id = pt.tag_id
    WHERE pt.product_id = ANY(${productIds})
    ORDER BY t.name ASC
  `;

  for (const row of rows) {
    const productId = Number(row.product_id);
    const tag: Tag = {
      id: Number(row.id),
      name: String(row.name),
      slug: String(row.slug),
      created_at: row.created_at as Date | string,
    };
    const existing = tagsByProductId.get(productId) ?? [];
    existing.push(tag);
    tagsByProductId.set(productId, existing);
  }

  return tagsByProductId;
};

export const findOrCreateTagByName = async (
  name: string,
): Promise<Tag | undefined> => {
  const trimmedName = name.trim();
  const slug = slugify(trimmedName);
  if (!trimmedName || !slug) return undefined;

  const existing = await findTagBySlug(slug);
  if (existing) return existing;

  const [tag] = await sql`
    INSERT INTO tags (name, slug)
    VALUES (${trimmedName}, ${slug})
    RETURNING id, name, slug, created_at
  `;
  return tag as Tag | undefined;
};

export const setProductTags = async (
  productId: number,
  tagIds: number[],
): Promise<void> => {
  await sql`
    DELETE FROM product_tags WHERE product_id = ${productId}
  `;

  for (const tagId of tagIds) {
    await sql`
      INSERT INTO product_tags (product_id, tag_id)
      VALUES (${productId}, ${tagId})
      ON CONFLICT DO NOTHING
    `;
  }
};

export const resolveTagIdsFromNames = async (
  names: string[],
): Promise<number[]> => {
  const uniqueNames = [
    ...new Set(names.map((name) => name.trim()).filter(Boolean)),
  ];
  const tagIds: number[] = [];

  for (const name of uniqueNames) {
    const tag = await findOrCreateTagByName(name);
    if (tag) tagIds.push(tag.id);
  }

  return tagIds;
};
