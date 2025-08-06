import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 Middleware called for path:', pathname);
  console.log('🔍 Full URL:', request.url);
  
  // Skip maintenance check for admin routes and API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    console.log('🔍 Skipping maintenance check for admin/API route');
    return NextResponse.next();
  }
  
  // Skip maintenance check for maintenance page itself
  if (pathname === '/maintenance') {
    console.log('🔍 Skipping maintenance check for maintenance page');
    return NextResponse.next();
  }
  
  try {
    // Check maintenance mode via API
    const baseUrl = request.nextUrl.origin;
    console.log('🔍 Middleware checking maintenance for path:', pathname);
    console.log('🔍 Base URL:', baseUrl);
    
    const maintenanceResponse = await fetch(`${baseUrl}/api/maintenance`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (maintenanceResponse.ok) {
      const data = await maintenanceResponse.json();
      console.log('🔍 Maintenance API response:', data);
      
      if (data.maintenanceMode) {
        console.log('🔍 Redirecting to maintenance page');
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    } else {
      console.log('❌ Maintenance API response not ok:', maintenanceResponse.status);
    }
  } catch (error) {
    console.error('❌ Error checking maintenance mode:', error);
    // Continue normally if there's an error
  }
  
  // Add cache-busting headers for homepage (after maintenance check)
  if (pathname === '/') {
    console.log('🔍 Adding cache-busting headers for homepage');
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Cache-Status', 'BYPASS');
    return response;
  }
  
  console.log('🔍 Middleware completed for path:', pathname);
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 