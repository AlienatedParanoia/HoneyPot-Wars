import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Refreshes the Supabase session on every request and guards protected routes.
// Auth state is verified server-side here, never trusted from the client alone.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Defense-in-depth: admin API routes require an authenticated caller. The
  // handlers also enforce admin, but guarding here means a future /api/admin
  // route can't be left publicly reachable by omission.
  if (path.startsWith('/api/admin') && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isClientArea =
    path.startsWith('/dashboard') || path.startsWith('/request-session');
  const isProtected = isClientArea || path.startsWith('/admin');

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(url);
  }

  // Admin status from the is_admin() RPC (admin_emails table) — the SAME source
  // pages and RLS use, so middleware routing can never disagree with them.
  // Resolved only when it affects routing, to avoid an RPC on every request.
  let isAdmin = false;
  if (user && (isClientArea || path.startsWith('/admin'))) {
    const { data } = await supabase.rpc('is_admin');
    isAdmin = data === true;
  }

  // Admin-only identity: admins never use the client area — bounce to /admin.
  if (isClientArea && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Non-admins cannot reach the admin console.
  if (path.startsWith('/admin') && user && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on app routes but skip static assets and Next internals.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
