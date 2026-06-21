import { NextResponse } from 'next/server';
import verifyToken from '@/lib/auth/verify-token';
import { internalServerError, unauthorized } from '@/lib/api/responses';

export type AuthPayload = { id: number };

const AUTH_ERRORS = ['Access denied', 'Invalid token', 'Token already used'];

export function isAuthError(error: unknown): boolean {
  return error instanceof Error && AUTH_ERRORS.includes(error.message);
}

type AuthedHandler = (
  request: Request,
  auth: AuthPayload
) => Promise<NextResponse>;

export function withAuth(handler: AuthedHandler) {
  return async (request: Request) => {
    try {
      const decoded = await verifyToken(request);
      const auth = decoded as AuthPayload;
      return await handler(request, auth);
    } catch (error) {
      if (isAuthError(error)) return unauthorized();
      console.error('Auth handler failed', error);
      return internalServerError();
    }
  };
}

type RouteContext<TParams extends Record<string, string> = Record<string, string>> = {
  params: Promise<TParams>;
};

type AuthedHandlerWithParams<TParams extends Record<string, string> = Record<string, string>> = (
  request: Request,
  auth: AuthPayload,
  context: RouteContext<TParams>
) => Promise<NextResponse>;

export function withAuthParams<TParams extends Record<string, string> = Record<string, string>>(
  handler: AuthedHandlerWithParams<TParams>
) {
  return async (request: Request, context: RouteContext<TParams>) => {
    try {
      const decoded = await verifyToken(request);
      const auth = decoded as AuthPayload;
      return await handler(request, auth, context);
    } catch (error) {
      if (isAuthError(error)) return unauthorized();
      console.error('Auth handler failed', error);
      return internalServerError();
    }
  };
}
