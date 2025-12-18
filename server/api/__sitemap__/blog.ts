import { defineSitemapEventHandler } from '#imports';
import type { SitemapUrlInput } from '@nuxtjs/sitemap/dist/runtime/types';

// Blog sitemap source - Just blog index page for now
// Articles API endpoint doesn't exist yet
export default defineSitemapEventHandler(async () => {
    const urls: SitemapUrlInput[] = [];

    // Add main blog page
    urls.push({
        loc: '/blog',
        changefreq: 'weekly',
        priority: 0.8,
    });

    // Note: When /api/articles endpoint is implemented, add fetching logic here
    // to include individual blog article URLs with cover images

    return urls;
});
