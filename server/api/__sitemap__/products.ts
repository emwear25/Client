// Server API endpoint to fetch all products for sitemap generation
// Uses @nuxtjs/sitemap v7 format

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const apiBase = config.public?.apiBase || 'https://api.emwear.bg';

    console.log('[Sitemap Products] Starting sitemap generation...');
    console.log('[Sitemap Products] API Base:', apiBase);

    try {
        // Fetch products from API
        const response = await $fetch<{ products: any[] }>(`${apiBase}/products`, {
            query: {
                limit: 1000,
            },
        });

        console.log('[Sitemap Products] API Response received');
        console.log('[Sitemap Products] Products count:', response?.products?.length || 0);

        if (!response?.products?.length) {
            console.warn('[Sitemap Products] No products found!');
            return [];
        }

        // Map products to sitemap URLs
        const urls = response.products.map((product: any) => {
            const entry: any = {
                loc: `/products/${product.slug || product._id}`,
                lastmod: product.updatedAt || new Date().toISOString(),
                changefreq: 'weekly',
                priority: 0.9,
            };

            // Add images if available
            if (product.images?.length) {
                entry.images = product.images.map((img: any) => ({
                    loc: img.url,
                    title: product.name || 'Product Image',
                }));
            }

            return entry;
        });

        console.log('[Sitemap Products] Generated', urls.length, 'URLs');
        if (urls.length > 0) {
            console.log('[Sitemap Products] First URL:', JSON.stringify(urls[0]));
        }

        return urls;
    } catch (error: any) {
        console.error('[Sitemap Products] Error:', error.message || error);
        return [];
    }
});
