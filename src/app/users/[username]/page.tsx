import { notFound } from "next/navigation";
import { Pagination, parsePageParam, withPageParam } from "@/components/products/Pagination";
import { UserProfile } from "@/components/users/UserProfile";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import {
  listProductsByUserId,
  withUserUpvoteState,
} from "@/lib/queries/products";
import { findPublicUserProfileByUsername } from "@/lib/queries/users";

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function MakerProfilePage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const user = await findPublicUserProfileByUsername(username);

  if (!user) {
    notFound();
  }

  const [result, currentUserId] = await Promise.all([
    listProductsByUserId(user.id, { page }),
    getCurrentUserId(),
  ]);
  const products = await withUserUpvoteState(result.products, currentUserId);

  return (
    <UserProfile
      user={user}
      products={products}
      pagination={
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          hrefForPage={(nextPage) =>
            withPageParam(`/users/${username}`, nextPage)
          }
        />
      }
    />
  );
}
