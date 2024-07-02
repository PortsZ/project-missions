import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // logic for authorization
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    '/auth/signup',
    // '/payment/:path*',
    // '/configuracoes/:path*',
    // '/api/payment/checkout-session',
    // '/api/company/:path*',
    // '/api/branding/:path*',
    // '/api/proposal',
    // '/configuracoes/:path*',
  ],
};
