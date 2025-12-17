// Server API endpoint to fetch all products for sitemap generation
// Uses @nuxtjs/sitemap v7 defineSitemapEventHandler
import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '#sitemap/types';

export default defineSitemapEventHandler(async () => {
    const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'https://api.emwear.bg';

    console.log('[Sitemap Products] Fetching products from:', apiBase);

    try {
        const response = await $fetch<{ products: any[] }>(`${apiBase}/products`, {
            query: {
                limit: 1000, // Get all products
            },
        });

        console.log('[Sitemap Products] Fetched products count:', response?.products?.length || 0);

        if (!response?.products?.length) {
            console.log('[Sitemap Products] No products found, returning empty array');
            return [];
        }

        const urls: SitemapUrlInput[] = response.products.map((product: any) => {
            const url: SitemapUrlInput = {
                loc: `/products/${product.slug || product._id}`,
                lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
                changefreq: 'weekly',
                priority: 0.9,
            };

            // Add images if available
            if (product.images?.length) {
                url.images = product.images.map((img: any) => ({
                    loc: img.url,
                    title: product.name,
                }));
            }

            return url;
        });

        console.log('[Sitemap Products] Generated URLs count:', urls.length);
        console.log('[Sitemap Products] Sample URL:', urls[0]);

        return urls;
    } catch (error) {
        console.error('[Sitemap Products] Error fetching products:', error);
        return [];
    }
});
