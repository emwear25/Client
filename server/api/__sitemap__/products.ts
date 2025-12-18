import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

interface ProductImage {
    url: string;
    alt?: string;
}

interface Product {
    _id: string;
    slug: string;
    name: string;
    description?: string;
    updatedAt?: string;
    images?: ProductImage[];
}

// Products sitemap source with images
export default defineSitemapEventHandler(async () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'https://api.emwear.bg';

    const urls: SitemapUrlInput[] = [];

    try {
        // Fetch all products with images for sitemap
        const response = await $fetch<{ success: boolean; data: Product[] }>(
            `${apiBase}/api/products?limit=1000&fields=slug,name,description,updatedAt,images`
        );

        if (response?.data) {
            for (const product of response.data) {
                if (product.slug) {
                    const entry: SitemapUrlInput = {
                        loc: `/products/${product.slug}`,
                        lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
                        changefreq: 'weekly',
                        priority: 0.8,
                    };

                    // Add product images for image sitemap
                    if (product.images && product.images.length > 0) {
                        entry.images = product.images.map((img, index) => ({
                            loc: img.url,
                            title: img.alt || product.name,
                            caption: index === 0
                                ? (product.description?.substring(0, 200) || `${product.name} - персонализиран детски продукт с бродерия от emWear`)
                                : `${product.name} - изображение ${index + 1}`,
                        }));
                    }

                    urls.push(entry);
                }
            }
        }
    } catch (error) {
        console.error('[Sitemap Products] Failed to fetch products:', error);
    }

    return urls;
});
