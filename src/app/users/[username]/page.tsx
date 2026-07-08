import { notFound } from "next/navigation";
import { UserProfile } from "@/components/users/UserProfile";
import { listProductsByUserId } from "@/lib/queries/products";
import { findPublicUserProfileByUsername } from "@/lib/queries/users";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function MakerProfilePage({ params }: PageProps) {
  const { username } = await params;
  const user = await findPublicUserProfileByUsername(username);

  if (!user) {
    notFound();
  }

  const products = await listProductsByUserId(user.id);

  return <UserProfile user={user} products={products} />;
}
