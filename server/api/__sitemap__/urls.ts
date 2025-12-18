import { defineSitemapEventHandler } from '#imports';

export default defineSitemapEventHandler(async () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'https://api.emwear.bg';

    const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = [];

    // Static pages
    const staticPages = [
        { loc: '/', changefreq: 'weekly', priority: 1.0 },
        { loc: '/products', changefreq: 'daily', priority: 0.9 },
        { loc: '/about', changefreq: 'monthly', priority: 0.7 },
        { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
        { loc: '/blog', changefreq: 'weekly', priority: 0.8 },
        { loc: '/faq', changefreq: 'monthly', priority: 0.6 },
        { loc: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
        { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
        { loc: '/shipping', changefreq: 'monthly', priority: 0.5 },
        { loc: '/sales', changefreq: 'daily', priority: 0.8 },
    ];
    urls.push(...staticPages);

    try {
        // Fetch products
        const productsResponse = await $fetch<{ products: { slug: string; updatedAt?: string }[] }>(
            `${apiBase}/products?limit=1000&fields=slug,updatedAt`
        );

        if (productsResponse?.products) {
            for (const product of productsResponse.products) {
                if (product.slug) {
                    urls.push({
                        loc: `/products/${product.slug}`,
                        lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
                        changefreq: 'weekly',
                        priority: 0.8,
                    });
                }
            }
        }
    } catch (error) {
        console.error('[Sitemap] Failed to fetch products:', error);
    }

    try {
        // Fetch categories
        const categoriesResponse = await $fetch<{ slug: string; updatedAt?: string }[]>(
            `${apiBase}/categories?fields=slug,updatedAt`
        );

        if (Array.isArray(categoriesResponse)) {
            for (const category of categoriesResponse) {
                if (category.slug) {
                    urls.push({
                        loc: `/category/${category.slug}`,
                        lastmod: category.updatedAt ? new Date(category.updatedAt).toISOString() : undefined,
                        changefreq: 'weekly',
                        priority: 0.7,
                    });
                }
            }
        }
    } catch (error) {
        console.error('[Sitemap] Failed to fetch categories:', error);
    }

    try {
        // Fetch blog articles
        const articlesResponse = await $fetch<{ articles: { slug: string; updatedAt?: string }[] }>(
            `${apiBase}/articles?limit=100&fields=slug,updatedAt`
        );

        if (articlesResponse?.articles) {
            for (const article of articlesResponse.articles) {
                if (article.slug) {
                    urls.push({
                        loc: `/blog/${article.slug}`,
                        lastmod: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
                        changefreq: 'monthly',
                        priority: 0.6,
                    });
                }
            }
        }
    } catch (error) {
        console.error('[Sitemap] Failed to fetch articles:', error);
    }

    return urls;
});
