import { NextResponse } from "next/server";
import { TENANT_DOMAINS, RESERVED_SUBDOMAINS } from "./src/config/tenants";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Extract domain and subdomain
  const hostParts = host.split('.');
  const subdomain = hostParts[0];
  const domain = hostParts.slice(1).join('.');

  // Check if this is a known tenant domain
  const tenantConfig = TENANT_DOMAINS[domain];

  if (tenantConfig) {
    // This is a tenant domain
    console.log(`Tenant domain detected: ${domain}, subdomain: ${subdomain}`);

    // Check if it's a valid subdomain (not reserved)
    if (
      subdomain && 
      subdomain !== domain &&
      !RESERVED_SUBDOMAINS.includes(subdomain) &&
      !host.includes("localhost") &&
      !host.includes("127.0.0.1") &&
      !host.includes("vercel.app") &&
      !host.includes("netlify.app")
    ) {
      // This is a website subdomain - route to site page
      console.log(`Routing subdomain ${subdomain} to /site/${subdomain}`);
      url.pathname = `/site/${subdomain}`;
      
      // Add tenant context to headers for potential use
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-tenant-domain', domain);
      requestHeaders.set('x-tenant-name', tenantConfig.name);
      requestHeaders.set('x-tenant-theme', tenantConfig.theme);
      
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
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
