import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- PROTECTING ROUTES ---

  // 1. If trying to access /dashboard and NOT logged in
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    // Capture the current path to redirect back later
    const currentPath = request.nextUrl.pathname;
    const loginUrl = new URL("/auth/sign-in", request.url);

    // Attach the 'next' parameter so we remember where they were going
    loginUrl.searchParams.set("next", currentPath);

    return NextResponse.redirect(loginUrl);
  }

  // 2. Prevent logged-in users from hitting sign-in/sign-up
  if (
    user &&
    (request.nextUrl.pathname === "/auth/sign-in" ||
      request.nextUrl.pathname === "/auth/sign-up")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/sign-in", "/auth/sign-up"],
};
