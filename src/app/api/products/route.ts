import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/with-auth';
import {
  internalServerError,
  validationError,
} from '@/lib/api/responses';
import {
  createProduct,
  getProductBySlug,
  listProducts,
  listProductsForToday,
} from '@/lib/queries/products';
import {
  resolveTagIdsFromNames,
  setProductTags,
} from '@/lib/queries/tags';
import { createProductValidation } from '@/lib/validations/product';
import { slugify } from '@/lib/utils/slug';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const todayOnly = searchParams.get('today') === 'true';
    const page = Number(searchParams.get('page') ?? '1');

    const result = todayOnly
      ? await listProductsForToday({ page })
      : await listProducts({ page });

    return NextResponse.json(
      {
        products: result.products,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('List products failed', error);
    return internalServerError();
  }
};

export const POST = withAuth(async (req, { id: userId }) => {
  try {
    const body: unknown = await req.json();
    const { error, value } = createProductValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const {
      name,
      tagline,
      url,
      slug: providedSlug,
      description,
      logo_url,
      tags = [],
    } = value as {
      name: string;
      tagline: string;
      url: string;
      slug?: string;
      description?: string | null;
      logo_url?: string | null;
      tags?: string[];
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
    const normalizedLogoUrl =
      logo_url === '' || logo_url === undefined ? null : logo_url;

    const product = await createProduct(
      name,
      slug,
      tagline,
      normalizedDescription,
      url,
      userId,
      normalizedLogoUrl,
    );

    if (tags.length > 0) {
      const tagIds = await resolveTagIdsFromNames(tags);
      await setProductTags(product.id, tagIds);
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product failed', error);
    return internalServerError();
  }
});
