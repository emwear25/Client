// Server API endpoint to fetch all categories for sitemap generation
// Uses @nuxtjs/sitemap v7 defineSitemapEventHandler
import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '#sitemap/types';

export default defineSitemapEventHandler(async () => {
    const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'https://api.emwear.bg';

    console.log('[Sitemap Categories] Fetching categories from:', apiBase);

    try {
        const response = await $fetch<any[]>(`${apiBase}/categories`);

        console.log('[Sitemap Categories] Fetched categories count:', response?.length || 0);

        if (!response?.length) {
            console.log('[Sitemap Categories] No categories found, returning empty array');
            return [];
        }

        const urls: SitemapUrlInput[] = response.map((category: any) => ({
            loc: `/category/${category.slug || category._id}`,
            lastmod: category.updatedAt ? new Date(category.updatedAt).toISOString() : new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
        }));

        console.log('[Sitemap Categories] Generated URLs count:', urls.length);
        console.log('[Sitemap Categories] Sample URL:', urls[0]);

        return urls;
    } catch (error) {
        console.error('[Sitemap Categories] Error fetching categories:', error);
        return [];
    }
});
