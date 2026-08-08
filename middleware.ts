import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;

  // Protect admin dashboard
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect submission form
  if (path.match(/^\/conference\/.+\/submit$/)) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!session.user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/login?unverified=true', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/conference/:path*/submit']
};
