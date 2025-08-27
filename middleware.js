import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Debug logging
  console.log('🔍 Middleware Debug:', {
    host: host,
    pathname: req.nextUrl.pathname,
    fullUrl: req.nextUrl.href
  });

  // Extract subdomain from host
  const subdomain = host.split(".")[0];

  console.log('🔍 Subdomain extracted:', subdomain);

  // Check if it's a subdomain (not www, not the main domain, and not localhost)
  if (
    subdomain && 
    subdomain !== "www" && 
    subdomain !== "jirocash" &&
    subdomain !== "api" &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1") &&
    !host.includes("vercel.app") &&
    !host.includes("netlify.app")
  ) {
    // Rewrite to the site route with the subdomain as slug
    const newPathname = `/site/${subdomain}`;
    url.pathname = newPathname;
    
    console.log('🔄 Rewriting URL:', {
      from: req.nextUrl.pathname,
      to: newPathname,
      subdomain: subdomain
    });
    
    return NextResponse.rewrite(url);
  }

  console.log('⏭️ No rewrite needed, continuing...');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
