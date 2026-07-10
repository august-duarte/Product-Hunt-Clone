import sql from '@/lib/db';
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
