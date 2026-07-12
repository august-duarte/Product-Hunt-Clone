import sql from '@/lib/db';
import type { Upvote } from '@/types/upvote';

export type ToggleUpvoteResult = {
  upvoted: boolean;
  upvote_count: number;
};

export const hasUserUpvoted = async (
  userId: number,
  productId: number,
): Promise<boolean> => {
  const [upvote] = await sql`
    SELECT id FROM upvotes
    WHERE user_id = ${userId}
      AND product_id = ${productId}
  `;

  return Boolean(upvote);
};

export const getUpvotedProductIds = async (
  userId: number,
  productIds: number[],
): Promise<Set<number>> => {
  if (productIds.length === 0) return new Set();

  const rows = await sql`
    SELECT product_id
    FROM upvotes
    WHERE user_id = ${userId}
      AND product_id = ANY(${productIds})
  `;

  return new Set(rows.map((row) => Number(row.product_id)));
};

export const getUpvoteCount = async (productId: number): Promise<number> => {
  const [result] = await sql`
    SELECT COUNT(*)::int AS upvote_count
    FROM upvotes
    WHERE product_id = ${productId}
  `;

  return Number(result?.upvote_count ?? 0);
};

export const toggleUpvote = async (
  userId: number,
  productId: number,
): Promise<ToggleUpvoteResult> => {
  const alreadyUpvoted = await hasUserUpvoted(userId, productId);

  if (alreadyUpvoted) {
    await sql`
      DELETE FROM upvotes
      WHERE user_id = ${userId}
        AND product_id = ${productId}
    `;

    return {
      upvoted: false,
      upvote_count: await getUpvoteCount(productId),
    };
  }

  await sql`
    INSERT INTO upvotes (user_id, product_id)
    VALUES (${userId}, ${productId})
    ON CONFLICT (user_id, product_id) DO NOTHING
  `;

  return {
    upvoted: true,
    upvote_count: await getUpvoteCount(productId),
  };
};

export const getUpvote = async (
  userId: number,
  productId: number,
): Promise<Upvote | undefined> => {
  const [upvote] = await sql`
    SELECT id, user_id, product_id, created_at
    FROM upvotes
    WHERE user_id = ${userId}
      AND product_id = ${productId}
  `;

  return upvote as Upvote | undefined;
};
