import { NextResponse } from 'next/server';
import {
  internalServerError,
  invalidProductId,
  productNotFound,
} from '@/lib/api/responses';
import { getProductById } from '@/lib/queries/products';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (_req: Request, { params }: RouteContext) => {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return invalidProductId();
    }

    const product = await getProductById(productId);
    if (!product) return productNotFound();

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Get product failed', error);
    return internalServerError();
  }
};
