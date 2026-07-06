import { NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/api/with-auth';
import {
  internalServerError,
  invalidProductId,
  productNotFound,
  validationError,
} from '@/lib/api/responses';
import { addComment, listCommentsForProduct } from '@/lib/queries/comments';
import { getProductById } from '@/lib/queries/products';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseProductId(id: string): number | null {
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) return null;
  return productId;
}

export const GET = async (_req: Request, { params }: RouteContext) => {
  try {
    const { id } = await params;
    const productId = parseProductId(id);

    if (productId === null) {
      return invalidProductId();
    }

    const product = await getProductById(productId);
    if (!product) return productNotFound();

    const comments = await listCommentsForProduct(productId);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('List comments failed', error);
    return internalServerError();
  }
};

export const POST = withAuthParams<{ id: string }>(async (
  req,
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

    const body: unknown = await req.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      !('body' in body) ||
      typeof body.body !== 'string' ||
      body.body.trim().length === 0
    ) {
      return validationError('Comment body is required');
    }

    const comment = await addComment(
      Number(userId),
      productId,
      body.body.trim(),
    );

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Create comment failed', error);
    return internalServerError();
  }
});
