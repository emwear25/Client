/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap with all products, categories, and static pages
 * With image support for Google
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.frontendUrl || "https://emwear.bg";
  const apiBase = config.public.apiBase || "https://api.emwear.bg";

  console.log('[Sitemap] Generating sitemap...');
  console.log('[Sitemap] Base URL:', baseUrl);
  console.log('[Sitemap] API Base:', apiBase);

  try {
    // Fetch products from API - try both endpoint formats
    let products: any[] = [];
    try {
      // Try the /products endpoint first (without /api prefix)
      const productsResponse = await $fetch<{ products: any[] }>(
        `${apiBase}/products?limit=10000`
      );
      products = productsResponse?.products || [];
      console.log('[Sitemap] Fetched products from /products:', products.length);
    } catch (e1: any) {
      console.log('[Sitemap] /products failed, trying /api/products:', e1.message);
      try {
        // Fallback to /api/products endpoint
        const productsResponse = await $fetch<{ success: boolean; data: any[] }>(
          `${apiBase}/api/products?active=true&limit=10000`
        );
        products = productsResponse?.data || [];
        console.log('[Sitemap] Fetched products from /api/products:', products.length);
      } catch (e2: any) {
        console.error('[Sitemap] Both product endpoints failed:', e2.message);
      }
    }

    // Fetch categories from API - try both endpoint formats
    let categories: any[] = [];
    try {
      // Try the /categories endpoint first (without /api prefix)
      const categoriesResponse = await $fetch<any[]>(
        `${apiBase}/categories`
      );
      categories = categoriesResponse || [];
      console.log('[Sitemap] Fetched categories from /categories:', categories.length);
    } catch (e1: any) {
      console.log('[Sitemap] /categories failed, trying /api/categories:', e1.message);
      try {
        // Fallback to /api/categories endpoint
        const categoriesResponse = await $fetch<{ success: boolean; data: any[] }>(
          `${apiBase}/api/categories?active=true`
        );
        categories = categoriesResponse?.data || [];
        console.log('[Sitemap] Fetched categories from /api/categories:', categories.length);
      } catch (e2: any) {
        console.error('[Sitemap] Both category endpoints failed:', e2.message);
      }
    }

    // Build sitemap URLs
    const staticUrls = [
      { loc: `${baseUrl}/`, changefreq: "daily", priority: 1.0 },
      { loc: `${baseUrl}/products`, changefreq: "daily", priority: 0.9 },
      { loc: `${baseUrl}/about`, changefreq: "monthly", priority: 0.7 },
      { loc: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.7 },
      { loc: `${baseUrl}/blog`, changefreq: "weekly", priority: 0.6 },
      { loc: `${baseUrl}/privacy-policy`, changefreq: "monthly", priority: 0.3 },
      { loc: `${baseUrl}/terms`, changefreq: "monthly", priority: 0.3 },
      { loc: `${baseUrl}/shipping`, changefreq: "monthly", priority: 0.5 },
      { loc: `${baseUrl}/collections`, changefreq: "weekly", priority: 0.7 },
      { loc: `${baseUrl}/sales`, changefreq: "daily", priority: 0.8 },
    ];

    // Generate XML with image namespace support
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    staticUrls.forEach((url) => {
      sitemap += `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
    });

    // Add category pages
    categories.forEach((category: any) => {
      if (category.slug) {
        sitemap += `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    });

    // Add product pages with images
    products.forEach((product: any) => {
      const slug = product.slug || product._id;
      const lastmod = product.updatedAt
        ? new Date(product.updatedAt).toISOString().split("T")[0]
        : "";

      sitemap += `  <url>
    <loc>${baseUrl}/products/${slug}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;

      // Add images if available
      if (product.images?.length) {
        product.images.forEach((img: any) => {
          if (img.url) {
            sitemap += `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${escapeXml(product.name || 'Product Image')}</image:title>
    </image:image>`;
          }
        });
      }

      sitemap += `
  </url>
`;
    });

    sitemap += `</urlset>`;

    console.log('[Sitemap] Generated sitemap with', staticUrls.length, 'static +', categories.length, 'categories +', products.length, 'products');

    event.node.res.setHeader("Content-Type", "application/xml");
    event.node.res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return sitemap;
  } catch (error: any) {
    console.error("[Sitemap] Generation error:", error.message || error);
    event.node.res.statusCode = 500;
    return "Error generating sitemap";
  }
});

// Helper to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
