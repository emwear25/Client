/**
 * Composable for Facebook Pixel tracking
 * Provides type-safe helpers for e-commerce events
 */

export const useFacebookPixel = () => {
    const { $fbq, $fbqCustom } = useNuxtApp();

    /**
     * Track ViewContent event (Product Detail Page)
     */
    const trackViewContent = (product: {
        id: string;
        name: string;
        price: number;
        category?: string;
    }) => {
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
