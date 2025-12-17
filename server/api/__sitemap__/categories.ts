// Server API endpoint to fetch all categories for sitemap generation
// Returns category slugs and lastmod for sitemap entries

export default defineEventHandler(async () => {
    const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'https://api.emwear.bg';

    try {
        const response = await $fetch<any[]>(`${apiBase}/categories`);

        return (response || []).map((category: any) => ({
            loc: `/category/${category.slug || category._id}`,
            lastmod: category.updatedAt || new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Sitemap categories fetch error:', error);
        return [];
    }
});
