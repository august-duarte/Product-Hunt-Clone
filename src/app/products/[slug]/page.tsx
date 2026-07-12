import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { listCommentsForProduct } from "@/lib/queries/comments";
import { getProductDetailBySlug } from "@/lib/queries/products";
import { hasUserUpvoted } from "@/lib/queries/upvotes";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  const [comments, userId] = await Promise.all([
    listCommentsForProduct(product.id),
    getCurrentUserId(),
  ]);

  const userHasUpvoted = userId
    ? await hasUserUpvoted(userId, product.id)
    : false;

  return (
    <ProductDetail
      product={{ ...product, user_has_upvoted: userHasUpvoted }}
      comments={comments}
    />
  );
}
