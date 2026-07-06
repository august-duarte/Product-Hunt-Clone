import sql from '@/lib/db';
import type { Comment, CommentWithUser } from '@/types/comment';

export const addComment = async (
  userId: number,
  productId: number,
  body: string,
): Promise<Comment> => {
  const [comment] = await sql`
    INSERT INTO comments (user_id, product_id, body)
    VALUES (${userId}, ${productId}, ${body})
    RETURNING id, user_id, product_id, body, created_at
  `;

  return comment as Comment;
};

export const listCommentsForProduct = async (
  productId: number,
): Promise<CommentWithUser[]> => {
  const comments = await sql`
    SELECT
      c.id,
      c.user_id,
      c.product_id,
      c.body,
      c.created_at,
      u.name AS user_name,
      u.avatar_url AS user_avatar_url
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.product_id = ${productId}
    ORDER BY c.created_at ASC
  `;

  return comments as CommentWithUser[];
};
