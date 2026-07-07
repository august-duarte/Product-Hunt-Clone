import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";
import { listCommentsForProduct } from "@/lib/queries/comments";
import { getProductBySlug } from "@/lib/queries/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const comments = await listCommentsForProduct(product.id);

  return (
    <main className="py-12">
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">
        {product.name}
      </h1>
      <p className="mb-6 text-lg text-gray-700">{product.tagline}</p>

      {product.description && (
        <p className="mb-6 whitespace-pre-wrap text-gray-700">
          {product.description}
        </p>
      )}

      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:underline"
      >
        Visit website
      </Link>

      <section className="mt-12 max-w-2xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Comments
        </h2>
        <div className="mb-6">
          <CommentForm productId={product.id} />
        </div>
        <CommentList comments={comments} />
      </section>
    </main>
  );
}
