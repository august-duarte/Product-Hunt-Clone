import { notFound, redirect } from "next/navigation";
import { EditProductForm } from "@/components/products/EditProductForm";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { getProductDetailBySlug } from "@/lib/queries/products";

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  if (userId !== product.user_id) {
    redirect(`/products/${slug}`);
  }

  return <EditProductForm product={product} />;
}
