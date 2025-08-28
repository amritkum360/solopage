import { NextResponse } from "next/server";

export async function middleware(req) {
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
    // Only rewrite if we're on the root path (/) or empty path
    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "") {
      const newPathname = `/site/${subdomain}`;
      url.pathname = newPathname;
      
      console.log('🔄 Rewriting URL:', {
        from: req.nextUrl.pathname,
        to: newPathname,
        subdomain: subdomain
      });
      
      return NextResponse.rewrite(url);
    }
  }

  // Check if it's a custom domain (not jirocash.com and not localhost)
  if (
    !host.includes("jirocash.com") &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1") &&
    !host.includes("vercel.app") &&
    !host.includes("netlify.app") &&
    !host.includes("vercel-dns.com")
  ) {
    // This might be a custom domain
    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "") {
      try {
        // Check database for custom domain mapping via API
        const response = await fetch(`${req.nextUrl.origin}/api/site-by-domain/${host}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            // Rewrite to the correct site slug
            const newPathname = `/site/${data.siteSlug}`;
            url.pathname = newPathname;
            
            console.log('🌐 Custom domain mapping found:', {
              host: host,
              siteSlug: data.siteSlug,
              from: req.nextUrl.pathname,
              to: newPathname
            });
            
            return NextResponse.rewrite(url);
          }
        } else {
          console.log('🌐 Custom domain not found in database:', host);
        }
      } catch (error) {
        console.error('Error checking custom domain:', error);
      }
    }
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
