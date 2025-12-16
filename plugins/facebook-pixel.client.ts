/**
 * Facebook Pixel Plugin for Nuxt 3
 * Client-side only plugin for Meta Pixel tracking
 */

export default defineNuxtPlugin((nuxtApp) => {
    // Your Meta Pixel ID
    const pixelId = '1363872864704654';

    // Initialize Facebook Pixel
    const initFacebookPixel = () => {
        // Check if fbq already exists
        if (window.fbq) return;

        // Facebook Pixel base code
        (function (f: any, b: any, e: string, v: string, n?: any, t?: any, s?: any) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        // Initialize pixel
        window.fbq('init', pixelId);

        // Track initial page view
        window.fbq('track', 'PageView');
    };

    // Initialize on client side
    if (process.client) {
        initFacebookPixel();

        // Track page views on route changes
        nuxtApp.hook('page:finish', () => {
            if (window.fbq) {
                window.fbq('track', 'PageView');
            }
        });
    }

    // Provide helper function for components
    return {
        provide: {
            fbq: (event: string, data?: any) => {
                if (process.client && window.fbq) {
                    window.fbq('track', event, data);
                }
            },
            fbqCustom: (event: string, data?: any) => {
                if (process.client && window.fbq) {
                    window.fbq('trackCustom', event, data);
                }
            },
        },
    };
});

// TypeScript declarations
declare global {
    interface Window {
        fbq: any;
        _fbq: any;
    }
}
