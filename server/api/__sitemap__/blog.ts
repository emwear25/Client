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

// Blog articles sitemap source with cover images
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
        // Fetch all published blog articles
        const response = await $fetch<{ articles: Article[] }>(
            `${apiBase}/articles?limit=100&fields=slug,title,excerpt,updatedAt,coverImage`
        );

        if (response?.articles) {
            for (const article of response.articles) {
                if (article.slug) {
                    const entry: SitemapUrlInput = {
                        loc: `/blog/${article.slug}`,
                        lastmod: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
                        changefreq: 'monthly',
                        priority: 0.6,
                    };

                    // Add article cover image
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
