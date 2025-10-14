import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /convex/`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
