import { NextResponse } from 'next/server';

export const ApiErrors = {
  UNAUTHORIZED: 'Unauthorized',
  INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later',
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_USER_ID: 'Invalid user id',
  INVALID_PRODUCT_ID: 'Invalid product id',
  NOT_ALLOWED: 'Not allowed',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  SAME_PASSWORD: 'New password cannot be the same as the old password',
  INVALID_OLD_PASSWORD: 'Invalid old password',
} as const;

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export const unauthorized = () => errorResponse(ApiErrors.UNAUTHORIZED, 401);

export const forbidden = () => errorResponse(ApiErrors.NOT_ALLOWED, 403);

export const notFound = () => errorResponse(ApiErrors.USER_NOT_FOUND, 404);

export const productNotFound = () =>
  errorResponse(ApiErrors.PRODUCT_NOT_FOUND, 404);

export const internalServerError = () =>
  errorResponse(ApiErrors.INTERNAL_SERVER_ERROR, 500);

export const validationError = (message: string) => errorResponse(message, 400);

export const emailAlreadyExists = () =>
  errorResponse(ApiErrors.EMAIL_ALREADY_EXISTS, 400);

export const invalidUserId = () => errorResponse(ApiErrors.INVALID_USER_ID, 400);

export const invalidProductId = () =>
  errorResponse(ApiErrors.INVALID_PRODUCT_ID, 400);

export const invalidEmailOrPassword = () =>
  errorResponse(ApiErrors.INVALID_EMAIL_OR_PASSWORD, 400);

export const samePassword = () => errorResponse(ApiErrors.SAME_PASSWORD, 400);

export const invalidOldPassword = () =>
  errorResponse(ApiErrors.INVALID_OLD_PASSWORD, 400);
