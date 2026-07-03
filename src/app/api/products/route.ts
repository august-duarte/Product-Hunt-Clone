import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/with-auth';
import {
  internalServerError,
  validationError,
} from '@/lib/api/responses';
import { createProduct, getProductBySlug } from '@/lib/queries/products';
import { createProductValidation } from '@/lib/validations/product';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const POST = withAuth(async (req, { id: userId }) => {
  try {
    const body: unknown = await req.json();
    const { error, value } = createProductValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, tagline, url, slug: providedSlug, description } = value as {
      name: string;
      tagline: string;
      url: string;
      slug?: string;
      description?: string | null;
    };

    const slug = providedSlug ?? slugify(name);
    if (!slug) {
      return validationError('Could not generate a valid slug from product name');
    }

    const existing = await getProductBySlug(slug);
    if (existing) {
      return validationError('Slug already exists');
    }

    const normalizedDescription =
      description === '' || description === undefined ? null : description;

    const product = await createProduct(
      name,
      slug,
      tagline,
      normalizedDescription,
      url,
      userId,
    );

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product failed', error);
    return internalServerError();
  }
});
