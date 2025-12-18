import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

interface Category {
    _id: string;
    slug: string;
    name: string;
    description?: string;
    updatedAt?: string;
    image?: string;
}

// Categories/Collections sitemap source with images
export default defineSitemapEventHandler(async () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'https://api.emwear.bg';

    const urls: SitemapUrlInput[] = [];

    try {
        // Fetch all categories with images
        const response = await $fetch<Category[]>(
            `${apiBase}/categories?fields=slug,name,description,updatedAt,image`
        );

        if (Array.isArray(response)) {
            for (const category of response) {
                if (category.slug) {
                    const entry: SitemapUrlInput = {
                        loc: `/category/${category.slug}`,
                        lastmod: category.updatedAt ? new Date(category.updatedAt).toISOString() : undefined,
                        changefreq: 'weekly',
                        priority: 0.7,
                    };

                    // Add category image
                    if (category.image) {
                        entry.images = [{
                            loc: category.image,
                            title: category.name,
                            caption: category.description?.substring(0, 200) || `${category.name} - колекция персонализирани детски продукти с бродерия`,
                        }];
                    }

                    urls.push(entry);
                }
            }
        }
    } catch (error) {
        console.error('[Sitemap Categories] Failed to fetch categories:', error);
    }

    return urls;
});
