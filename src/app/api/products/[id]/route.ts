import { NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/api/with-auth';
import {
  forbidden,
  internalServerError,
  invalidProductId,
  productNotFound,
  validationError,
} from '@/lib/api/responses';
import {
  deleteProduct,
  getProductById,
  getProductBySlug,
  updateProduct,
} from '@/lib/queries/products';
import {
  resolveTagIdsFromNames,
  setProductTags,
} from '@/lib/queries/tags';
import { updateProductValidation } from '@/lib/validations/product';
import type { UpdateProductInput } from '@/types/product';

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

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Get product failed', error);
    return internalServerError();
  }
};

export const PATCH = withAuthParams<{ id: string }>(async (
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

    const existing = await getProductById(productId);
    if (!existing) return productNotFound();

    if (existing.user_id !== Number(userId)) {
      return forbidden();
    }

    const body: unknown = await req.json();
    const { error, value } = updateProductValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const updates = value as UpdateProductInput;

    const name = updates.name ?? existing.name;
    const slug = updates.slug ?? existing.slug;
    const tagline = updates.tagline ?? existing.tagline;
    const url = updates.url ?? existing.url;
    const description =
      updates.description === undefined
        ? existing.description
        : updates.description === ''
          ? null
          : updates.description;

    if (slug !== existing.slug) {
      const slugTaken = await getProductBySlug(slug);
      if (slugTaken) {
        return validationError('Slug already exists');
      }
    }

    const product = await updateProduct(
      productId,
      name,
      slug,
      tagline,
      description,
      url,
    );

    if (!product) return productNotFound();

    if (updates.tags !== undefined) {
      const tagIds = await resolveTagIdsFromNames(updates.tags);
      await setProductTags(productId, tagIds);
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Update product failed', error);
    return internalServerError();
  }
});

export const DELETE = withAuthParams<{ id: string }>(async (
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

    const existing = await getProductById(productId);
    if (!existing) return productNotFound();

    if (existing.user_id !== Number(userId)) {
      return forbidden();
    }

    const deleted = await deleteProduct(productId);
    if (!deleted) return productNotFound();

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Delete product failed', error);
    return internalServerError();
  }
});
