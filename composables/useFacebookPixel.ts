/**
 * Composable for Facebook Pixel tracking
 * Provides type-safe helpers for e-commerce events
 */

export const useFacebookPixel = () => {
    const { $fbq, $fbqCustom, $posthog } = useNuxtApp();

    // Mirror shop events to PostHog (runs for all visitors - see plugins/posthog.client.ts)
    const ph = (event: string, props: Record<string, unknown>) => {
        try {
            $posthog?.capture(event, { currency: 'EUR', ...props });
        } catch {
            // analytics must never break the shop
        }
    };

    /**
     * Track ViewContent event (Product Detail Page)
     */
    const trackViewContent = (product: {
        id: string;
        name: string;
        price: number;
        category?: string;
    }) => {
        ph('Product Viewed', { product_id: product.id, name: product.name, price: product.price, category: product.category || '' });
        $fbq('ViewContent', {
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product',
            value: product.price,
            currency: 'EUR',
            content_category: product.category || '',
        });
    };

    /**
     * Track AddToCart event
     */
    const trackAddToCart = (product: {
        id: string;
        name: string;
        price: number;
        quantity?: number;
    }) => {
        ph('Product Added', { product_id: product.id, name: product.name, price: product.price, quantity: product.quantity || 1, value: product.price * (product.quantity || 1) });
        $fbq('AddToCart', {
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product',
            value: product.price * (product.quantity || 1),
            currency: 'EUR',
        });
    };

    /**
     * Track InitiateCheckout event
     */
    const trackInitiateCheckout = (data: {
        value: number;
        items: Array<{ id: string; quantity: number }>;
    }) => {
        ph('Checkout Started', { value: data.value, products: data.items.map((i) => ({ product_id: i.id, quantity: i.quantity })) });
        $fbq('InitiateCheckout', {
            content_ids: data.items.map((item) => item.id),
            num_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
            value: data.value,
            currency: 'EUR',
        });
    };

    /**
     * Track Purchase event (Order Success)
     */
    const trackPurchase = (order: {
        orderId: string;
        total: number;
        items: Array<{ id: string; quantity: number; price: number }>;
    }) => {
        ph('Order Completed', { order_id: order.orderId, revenue: order.total, value: order.total, products: order.items.map((i) => ({ product_id: i.id, quantity: i.quantity, price: i.price })) });
        $fbq('Purchase', {
            content_ids: order.items.map((item) => item.id),
            content_type: 'product',
            value: order.total,
            currency: 'EUR',
            num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
        });
    };

    /**
     * Track Search event
     */
    const trackSearch = (searchQuery: string) => {
        ph('Products Searched', { query: searchQuery });
        $fbq('Search', {
            search_string: searchQuery,
        });
    };

    /**
     * Track AddToWishlist event
     */
    const trackAddToWishlist = (product: {
        id: string;
        name: string;
        price: number;
    }) => {
        ph('Product Added to Wishlist', { product_id: product.id, name: product.name, price: product.price });
        $fbq('AddToWishlist', {
            content_ids: [product.id],
            content_name: product.name,
            value: product.price,
            currency: 'EUR',
        });
    };

    /**
     * Track custom event
     */
    const trackCustomEvent = (eventName: string, data?: any) => {
        $fbqCustom(eventName, data);
    };

    return {
        trackViewContent,
        trackAddToCart,
        trackInitiateCheckout,
        trackPurchase,
        trackSearch,
        trackAddToWishlist,
        trackCustomEvent,
    };
};
