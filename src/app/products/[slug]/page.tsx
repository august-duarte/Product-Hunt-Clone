import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { listCommentsForProduct } from "@/lib/queries/comments";
import { getProductDetailBySlug } from "@/lib/queries/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  const comments = await listCommentsForProduct(product.id);

  return <ProductDetail product={product} comments={comments} />;
}
