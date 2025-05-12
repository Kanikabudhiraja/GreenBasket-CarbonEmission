import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware function to protect routes
export async function middleware(request) {
  const token = await getToken({ req: request });
  
  // Protected routes (require authentication)
  const protectedPaths = [
    "/profile",
    "/orders",
    "/checkout",
    "/wishlist",
  ];
  
  // Admin-only routes
  const adminPaths = [
    "/admin",
  ];
  
  const path = request.nextUrl.pathname;
  
  // Check for protected routes
  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    if (!token) {
      // Redirect to login page if not authenticated
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // Check for admin routes
  if (adminPaths.some(adminPath => path.startsWith(adminPath))) {
    if (!token || token.role !== "admin") {
      // Redirect to unauthorized page or home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // Allow access to the requested resource
  return NextResponse.next();
}

// Configure which paths middleware will run on
export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*", 
    "/checkout/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
  ],
}; 