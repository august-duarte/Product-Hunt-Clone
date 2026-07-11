"use client";

import Link from "next/link";
import { useUserAuth } from "@/hooks/user-auth";

type ProductOwnerActionsProps = {
  productSlug: string;
  ownerId: number;
};

export function ProductOwnerActions({
  productSlug,
  ownerId,
}: ProductOwnerActionsProps) {
  const { user, loading } = useUserAuth();

  if (loading || !user || user.id !== ownerId) {
    return null;
  }

  return (
    <Link
      href={`/products/${productSlug}/edit`}
      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-50"
    >
      Edit product
    </Link>
  );
}
