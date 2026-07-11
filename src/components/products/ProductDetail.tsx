import Link from "next/link";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";
import { ProductLogo } from "@/components/products/ProductLogo";
import { ProductOwnerActions } from "@/components/products/ProductOwnerActions";
import { UpvoteButton } from "@/components/products/UpvoteButton";
import { userProfilePath } from "@/lib/utils/slug";
import type { CommentWithUser } from "@/types/comment";
import type { ProductDetailItem } from "@/types/product";

type ProductDetailProps = {
  product: ProductDetailItem;
  comments: CommentWithUser[];
};

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProductDetail({ product, comments }: ProductDetailProps) {
  return (
    <main className="py-12">
      <section className="grid gap-8 lg:grid-cols-[1fr_12rem]">
        <div className="min-w-0">
          <div className="mb-6 flex items-start gap-4">
            <ProductLogo
              name={product.name}
              logoUrl={product.logo_url}
              seed={product.id}
              className="h-20 w-20 rounded-2xl text-2xl"
            />
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <p className="mt-2 text-lg text-gray-700">{product.tagline}</p>
              <p className="mt-2 text-sm text-gray-500">
                Launched by{" "}
                <Link
                  href={userProfilePath(product.maker_username)}
                  className="text-gray-700 hover:text-orange-500"
                >
                  {product.maker_name}
                </Link>{" "}
                on {formatDate(product.created_at)}
              </p>
            </div>
          </div>

          {product.description ? (
            <p className="whitespace-pre-wrap text-gray-700">
              {product.description}
            </p>
          ) : (
            <p className="text-gray-500">No description provided yet.</p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.length > 0 ? (
              product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-500"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No tags yet.</span>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <UpvoteButton productId={product.id} count={product.upvote_count} />
          <ProductOwnerActions
            productSlug={product.slug}
            ownerId={product.user_id}
          />
          <Link
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-orange-500 bg-orange-500 px-4 py-3 text-center text-sm font-medium text-white hover:bg-orange-600"
          >
            Visit website
          </Link>
          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-lg bg-white p-3">
              <p className="font-semibold text-gray-900">
                {product.upvote_count}
              </p>
              <p className="text-gray-500">Upvotes</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="font-semibold text-gray-900">
                {product.comment_count}
              </p>
              <p className="text-gray-500">Comments</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Comments</h2>
        <div className="mb-6">
          <CommentForm productId={product.id} />
        </div>
        <CommentList comments={comments} />
      </section>
    </main>
  );
}
