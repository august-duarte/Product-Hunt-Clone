import { Avatar } from "@/components/ui/Avatar";
import type { CommentWithUser } from "@/types/comment";

type CommentListProps = {
  comments: CommentWithUser[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        No comments yet. Start the conversation.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <article key={comment.id} className="flex gap-3">
          <Avatar
            name={comment.user_name}
            avatarUrl={comment.user_avatar_url}
            className="h-9 w-9 text-xs"
          />
          <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">
              {comment.user_name}
            </p>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {comment.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
