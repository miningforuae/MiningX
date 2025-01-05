// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  "/accountDeatils",
  "/market",

  // Add other protected routes here
]

// Add paths that should be accessible only for non-authenticated users
const authPaths = [
  '/signIn',
  '/signUp',
  '/about',
  '/demos',
  "/membership",


]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const path = request.nextUrl.pathname

  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp))
  const isAuthPath = authPaths.some(ap => path.startsWith(ap))

  // If trying to access protected route without token, redirect to login
  if (isProtectedPath && !token) {
    const response = NextResponse.redirect(new URL('/signIn', request.url))
    response.cookies.delete('token') // Clear any invalid tokens
    return response
  }

  // If trying to access auth routes (login/register) with valid token, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure middleware matching
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}