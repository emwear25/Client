import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

interface Category {
    _id: string;
    slug: string;
    name: string;
    displayName?: string;
    isActive?: boolean;
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
        const response = await $fetch<{ success: boolean; data: Category[] }>(
            `${apiBase}/api/categories?active=true`
        );

        if (response?.data && Array.isArray(response.data)) {
            for (const category of response.data) {
                // Inactive categories 404 on the storefront - keep them out
                if (category.slug && category.isActive !== false) {
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
                            title: category.displayName || category.name,
                            caption: category.description?.substring(0, 200) || `${category.displayName || category.name} - колекция персонализирани детски продукти с бродерия`,
                        }];
                    }

                    urls.push(entry);
                }
            }
        }
    } catch (error) {
        // Fail the request instead of silently publishing an EMPTY categories
        // sitemap - search engines keep their last good copy on errors
        console.error('[Sitemap Categories] Failed to fetch categories:', error);
        throw createError({ statusCode: 503, statusMessage: 'Categories sitemap source unavailable' });
    }

    return urls;
});
