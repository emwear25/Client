import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

interface Article {
    _id: string;
    slug: string;
    title: string;
    excerpt?: string;
    updatedAt?: string;
    coverImage?: string;
}

// Blog sitemap source - Includes blog index and all published articles
export default defineSitemapEventHandler(async () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'https://api.emwear.bg';

    const urls: SitemapUrlInput[] = [];

    // Add main blog page
    urls.push({
        loc: '/blog',
        changefreq: 'weekly',
        priority: 0.8,
    });

    try {
        // Fetch all published articles for sitemap
        const response = await $fetch<{ success: boolean; data: Article[] }>(
            `${apiBase}/api/articles`
        );

        if (response?.data) {
            for (const article of response.data) {
                if (article.slug) {
                    const entry: SitemapUrlInput = {
                        loc: `/blog/${article.slug}`,
                        lastmod: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
                        changefreq: 'monthly',
                        priority: 0.6,
                    };

                    // Add cover image if available
                    if (article.coverImage) {
                        entry.images = [{
                            loc: article.coverImage,
                            title: article.title,
                            caption: article.excerpt?.substring(0, 200) || article.title,
                        }];
                    }

                    urls.push(entry);
                }
            }
        }
    } catch (error) {
        console.error('[Sitemap Blog] Failed to fetch articles:', error);
    }

    return urls;
});
