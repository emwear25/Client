import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

interface Article {
    _id: string;
    slug: string;
    title: string;
    excerpt?: string;
    updatedAt?: string;
    featuredImage?: {
        url: string;
        alt?: string;
    };
}

interface ArticlesResponse {
    success: boolean;
    data: {
        articles: Article[];
    };
}

// Blog sitemap source - Includes blog index and all published articles
export default defineSitemapEventHandler(async () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'https://api.emwear.bg';

    const urls: SitemapUrlInput[] = [];

    try {
        // Fetch all published articles for sitemap
        const response = await $fetch<ArticlesResponse>(
            `${apiBase}/articles?limit=1000`
        );

        if (response?.data?.articles) {
            for (const article of response.data.articles) {
                if (article.slug) {
                    const entry: SitemapUrlInput = {
                        loc: `/blog/${article.slug}`,
                        lastmod: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
                        changefreq: 'monthly',
                        priority: 0.6,
                    };

                    // Add featured image if available
                    if (article.featuredImage?.url) {
                        entry.images = [{
                            loc: article.featuredImage.url,
                            title: article.featuredImage.alt || article.title,
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

    // Only list the blog index once there is something to read (an empty
    // listing page is thin content)
    if (urls.length > 0) {
        urls.unshift({ loc: '/blog', changefreq: 'weekly', priority: 0.7 });
    }

    return urls;
});
