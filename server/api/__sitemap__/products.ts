// Server API endpoint to fetch all products for sitemap generation
// Returns product slugs, images, and lastmod for sitemap entries

export default defineEventHandler(async () => {
    const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'https://api.emwear.bg';

    try {
        const response = await $fetch<{ products: any[] }>(`${apiBase}/products`, {
            query: {
                limit: 1000, // Get all products
                fields: 'slug,images,updatedAt,name,price',
            },
        });

        return (response.products || []).map((product: any) => ({
            loc: `/products/${product.slug || product._id}`,
            lastmod: product.updatedAt || new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.9,
            images: product.images?.length
                ? product.images.map((img: any) => ({
                    loc: img.url,
                    title: product.name,
                }))
                : undefined,
        }));
    } catch (error) {
        console.error('Sitemap products fetch error:', error);
        return [];
    }
});
