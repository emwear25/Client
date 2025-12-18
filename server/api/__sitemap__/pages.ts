import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

// Static pages sitemap source
export default defineSitemapEventHandler(async () => {
    const urls: SitemapUrlInput[] = [
        // Homepage - highest priority
        {
            loc: '/',
            changefreq: 'daily',
            priority: 1.0,
        },
        // Main product listing
        {
            loc: '/products',
            changefreq: 'daily',
            priority: 0.9,
        },
        // Sale page - high priority for promotions
        {
            loc: '/sales',
            changefreq: 'daily',
            priority: 0.9,
        },
        // About us page
        {
            loc: '/about',
            changefreq: 'monthly',
            priority: 0.7,
        },
        // Contact page
        {
            loc: '/contact',
            changefreq: 'monthly',
            priority: 0.7,
        },
        // FAQ page
        {
            loc: '/faq',
            changefreq: 'monthly',
            priority: 0.6,
        },
        // Shipping info
        {
            loc: '/shipping',
            changefreq: 'monthly',
            priority: 0.5,
        },
        // Legal pages - lowest priority
        {
            loc: '/privacy-policy',
            changefreq: 'yearly',
            priority: 0.3,
        },
        {
            loc: '/terms',
            changefreq: 'yearly',
            priority: 0.3,
        },
    ];

    return urls;
});
