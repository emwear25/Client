// Server API endpoint to fetch all categories for sitemap generation

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const apiBase = config.public?.apiBase || 'https://api.emwear.bg';

    console.log('[Sitemap Categories] Starting sitemap generation...');
    console.log('[Sitemap Categories] API Base:', apiBase);

    try {
        const response = await $fetch<any[]>(`${apiBase}/categories`);

        console.log('[Sitemap Categories] API Response received');
        console.log('[Sitemap Categories] Categories count:', response?.length || 0);

        if (!response?.length) {
            console.warn('[Sitemap Categories] No categories found!');
            return [];
        }

        const urls = response.map((category: any) => ({
            loc: `/category/${category.slug || category._id}`,
            lastmod: category.updatedAt || new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
        }));

        console.log('[Sitemap Categories] Generated', urls.length, 'URLs');
        if (urls.length > 0) {
            console.log('[Sitemap Categories] First URL:', JSON.stringify(urls[0]));
        }

        return urls;
    } catch (error: any) {
        console.error('[Sitemap Categories] Error:', error.message || error);
        return [];
    }
});
