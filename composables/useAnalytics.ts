/**
 * Google Analytics 4 E-commerce Tracking Composable
 * 
 * Type-safe wrapper for GA4 e-commerce events using nuxt-gtag.
 * Implements official GA4 e-commerce schema.
 */

/**
 * Product item for GA4 e-commerce events
 */
export interface AnalyticsProduct {
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
    item_brand?: string;
    item_category?: string;
    item_category2?: string;
    item_category3?: string;
    item_variant?: string;
    currency?: string;
}

/**
 * Purchase/transaction data for GA4
 */
export interface AnalyticsPurchase {
    transaction_id: string;
    value: number;
    currency: string;
    tax?: number;
    shipping?: number;
    coupon?: string;
    items: AnalyticsProduct[];
}

/**
 * Add to cart event data
 */
export interface AnalyticsAddToCart {
    currency?: string;
    value?: number;
    items: AnalyticsProduct[];
}

export const useAnalytics = () => {
    const { gtag } = useGtag();

    /**
     * Track product view (view_item event)
     * Call this on product detail pages
     */
    const trackViewItem = (product: AnalyticsProduct) => {
        try {
            gtag('event', 'view_item', {
                currency: product.currency || 'BGN',
                value: product.price * product.quantity,
                items: [product],
            });
        } catch (error) {
            console.error('[Analytics] Error tracking view_item:', error);
        }
    };

    /**
     * Track add to cart (add_to_cart event)
     * Call this when user adds item to cart
     */
    const trackAddToCart = (product: AnalyticsProduct | AnalyticsProduct[]) => {
        try {
            const items = Array.isArray(product) ? product : [product];
            const value = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            gtag('event', 'add_to_cart', {
                currency: items[0]?.currency || 'BGN',
                value,
                items,
            });
        } catch (error) {
            console.error('[Analytics] Error tracking add_to_cart:', error);
        }
    };

    /**
     * Track purchase completion (purchase event)
     * Call this on order success/thank you page
     */
    const trackPurchase = (purchase: AnalyticsPurchase) => {
        try {
            gtag('event', 'purchase', {
                transaction_id: purchase.transaction_id,
                value: purchase.value,
                currency: purchase.currency,
                tax: purchase.tax || 0,
                shipping: purchase.shipping || 0,
                coupon: purchase.coupon,
                items: purchase.items,
            });
        } catch (error) {
            console.error('[Analytics] Error tracking purchase:', error);
        }
    };

    /**
     * Track begin checkout (begin_checkout event)
     * Call this when user starts checkout process
     */
    const trackBeginCheckout = (data: AnalyticsAddToCart) => {
        try {
            const value = data.value || data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            gtag('event', 'begin_checkout', {
                currency: data.currency || 'BGN',
                value,
                items: data.items,
            });
        } catch (error) {
            console.error('[Analytics] Error tracking begin_checkout:', error);
        }
    };

    /**
     * Track remove from cart (remove_from_cart event)
     * Call this when user removes item from cart
     */
    const trackRemoveFromCart = (product: AnalyticsProduct | AnalyticsProduct[]) => {
        try {
            const items = Array.isArray(product) ? product : [product];
            const value = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            gtag('event', 'remove_from_cart', {
                currency: items[0]?.currency || 'BGN',
                value,
                items,
            });
        } catch (error) {
            console.error('[Analytics] Error tracking remove_from_cart:', error);
        }
    };

    /**
     * Track view cart (view_cart event)
     * Call this when user views their cart
     */
    const trackViewCart = (data: AnalyticsAddToCart) => {
        try {
            const value = data.value || data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            gtag('event', 'view_cart', {
                currency: data.currency || 'BGN',
                value,
                items: data.items,
            });
        } catch (error) {
            console.error('[Analytics] Error tracking view_cart:', error);
        }
    };

    return {
        trackViewItem,
        trackAddToCart,
        trackPurchase,
        trackBeginCheckout,
        trackRemoveFromCart,
        trackViewCart,
    };
};
