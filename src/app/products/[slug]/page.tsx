import Link from "next/link";
import { notFound } from "next/navigation";
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
    </main>
  );
}
