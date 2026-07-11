import { notFound, redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { EditProductForm } from "@/components/products/EditProductForm";
import { getAuthCookie } from "@/lib/auth/cookies";
import { getProductDetailBySlug } from "@/lib/queries/products";
import { findPublicUserById } from "@/lib/queries/users";

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCurrentUserId(): Promise<number | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return null;

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: number | string };
    const user = await findPublicUserById(Number(decoded.id));
    return user?.id ?? null;
  } catch {
    return null;
  }
}

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
