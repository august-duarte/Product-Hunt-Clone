import { NextResponse } from 'next/server';
import { internalServerError } from '@/lib/api/responses';
import { listTags } from '@/lib/queries/tags';

export const GET = async () => {
  try {
    const tags = await listTags();
    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error('List tags failed', error);
    return internalServerError();
  }
};
