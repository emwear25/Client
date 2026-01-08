/**
 * Redirect product ID URLs to slug URLs for SEO
 * This catches URLs like /products/6935e7d01c5ea21253090319 and redirects to /products/product-slug
 */
export default defineEventHandler(async (event) => {
    const path = event.path || getRequestURL(event).pathname;

    // Only handle /products/[id] routes
    if (!path.startsWith('/products/')) {
        return;
    }

    // Extract the product identifier from the path
    const match = path.match(/^\/products\/([a-f0-9]{24})$/i);

    if (!match) {
        // Not a MongoDB ObjectId pattern, let the route handle normally
        return;
    }

    const productId = match[1];

    try {
        // Fetch the product to get its slug
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || 'https://api.emwear.bg';

        const response = await $fetch<{ data: { slug?: string } }>(`${apiBase}/api/products/${productId}`);

        if (response?.data?.slug) {
            // 301 Permanent Redirect to the slug URL
            const redirectUrl = `/products/${response.data.slug}`;
            console.log(`[SEO] Redirecting ${path} -> ${redirectUrl}`);

            return sendRedirect(event, redirectUrl, 301);
        }
    } catch (error) {
        // Product not found or API error - let the page handle the 404
        console.error('[SEO] Redirect lookup failed:', error);
    }
});
