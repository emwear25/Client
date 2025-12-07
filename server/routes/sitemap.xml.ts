/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap with all products, categories, and static pages
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.frontendUrl || "https://emwear.bg";

  try {
    // Fetch products from API
    const apiBase = config.public.apiBase || "http://localhost:3030";
    const productsResponse = await $fetch<{ success: boolean; data: any[] }>(
      `${apiBase}/api/products?active=true&limit=10000`
    );

    const products = productsResponse?.data || [];

    // Fetch categories from API
    const categoriesResponse = await $fetch<{ success: boolean; data: any[] }>(
      `${apiBase}/api/categories?active=true`
    );

    const categories = categoriesResponse?.data || [];

    // Build sitemap URLs
    const urls: Array<{
      loc: string;
      lastmod?: string;
      changefreq: string;
      priority: number;
    }> = [];

    // Static pages
    urls.push({
      loc: `${baseUrl}/`,
      changefreq: "daily",
      priority: 1.0,
    });

    urls.push({
      loc: `${baseUrl}/products`,
      changefreq: "daily",
      priority: 0.9,
    });

    urls.push({
      loc: `${baseUrl}/about`,
      changefreq: "monthly",
      priority: 0.7,
    });

    urls.push({
      loc: `${baseUrl}/contact`,
      changefreq: "monthly",
      priority: 0.7,
    });

    urls.push({
      loc: `${baseUrl}/blog`,
      changefreq: "weekly",
      priority: 0.6,
    });

    // Category pages
    categories.forEach((category: any) => {
      if (category.slug) {
        urls.push({
          loc: `${baseUrl}/category/${category.slug}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    });

    // Product pages
    products.forEach((product: any) => {
      const slug = product.slug || product._id;
      urls.push({
        loc: `${baseUrl}/products/${slug}`,
        lastmod: product.updatedAt
          ? new Date(product.updatedAt).toISOString().split("T")[0]
          : undefined,
        changefreq: "weekly",
        priority: 0.8,
      });
    });

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    event.node.res.setHeader("Content-Type", "application/xml");
    event.node.res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return sitemap;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    event.node.res.statusCode = 500;
    return "Error generating sitemap";
  }
});
