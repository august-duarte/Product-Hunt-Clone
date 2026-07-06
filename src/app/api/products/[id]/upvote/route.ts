import { NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/api/with-auth';
import {
  internalServerError,
  invalidProductId,
  productNotFound,
} from '@/lib/api/responses';
import { getProductById } from '@/lib/queries/products';
import { toggleUpvote } from '@/lib/queries/upvotes';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseProductId(id: string): number | null {
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) return null;
  return productId;
}

export const POST = withAuthParams<{ id: string }>(async (
  _req,
  { id: userId },
  { params },
) => {
  try {
    const { id } = await params;
    const productId = parseProductId(id);

    if (productId === null) {
      return invalidProductId();
    }

    const product = await getProductById(productId);
    if (!product) return productNotFound();

    const result = await toggleUpvote(Number(userId), productId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Toggle upvote failed', error);
    return internalServerError();
  }
});
