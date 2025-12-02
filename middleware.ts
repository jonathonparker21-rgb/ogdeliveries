import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protocol = request.headers.get('x-forwarded-proto');
  if (protocol && protocol !== 'https') {
    const url = request.nextUrl;
    url.protocol = 'https:';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
