import { NextRequest, NextResponse } from 'next/server';

// This would normally fetch from your database
// For now, we'll create a static sitemap
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/homes',
    '/floor-plans',
    '/contact',
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
