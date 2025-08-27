import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Extract subdomain from host
  const subdomain = host.split(".")[0];

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
    url.pathname = `/site/${subdomain}`;
    return NextResponse.rewrite(url);
  }

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
