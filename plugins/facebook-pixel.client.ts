/**
 * Facebook Pixel Plugin for Nuxt 3
 * Client-side only plugin for Meta Pixel tracking
 *
 * GDPR: the pixel script is NOT loaded until the visitor accepts
 * marketing cookies. Consent decisions are read from the consent cookie
 * on load and from the CONSENT_EVENT window event afterwards
 * (see composables/useCookieConsent.ts).
 */

import { CONSENT_COOKIE_NAME, CONSENT_EVENT } from "~/composables/useCookieConsent";
import type { ConsentCategories } from "~/composables/useCookieConsent";

export default defineNuxtPlugin((nuxtApp) => {
    // Your Meta Pixel ID
    const pixelId = '1363872864704654';
    let initialized = false;

    // Initialize Facebook Pixel (only after marketing consent)
    const initFacebookPixel = () => {
        if (initialized) return;

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
        window.fbq('consent', 'grant');
        window.fbq('init', pixelId);

        // Track initial page view
        window.fbq('track', 'PageView');

        initialized = true;
    };

    // Read the stored consent decision (returning visitors)
    const consentCookie = useCookie<{ categories?: ConsentCategories } | null>(
        CONSENT_COOKIE_NAME,
        { default: () => null }
    );
    const hasMarketingConsent = consentCookie.value?.categories?.marketing === true;

    // Initialize on client side
    if (import.meta.client) {
        if (hasMarketingConsent) {
            initFacebookPixel();
        }

        // React to consent changes from the cookie banner
        window.addEventListener(CONSENT_EVENT, (event: Event) => {
            const categories = (event as CustomEvent<ConsentCategories>).detail;
            if (categories?.marketing) {
                if (initialized) {
                    window.fbq('consent', 'grant');
                } else {
                    initFacebookPixel();
                }
            } else if (initialized && window.fbq) {
                window.fbq('consent', 'revoke');
            }
        });

        // Track page views on route changes
        nuxtApp.hook('page:finish', () => {
            if (initialized && window.fbq) {
                window.fbq('track', 'PageView');
            }
        });
    }

    // Provide helper function for components
    return {
        provide: {
            fbq: (event: string, data?: any) => {
                if (import.meta.client && initialized && window.fbq) {
                    window.fbq('track', event, data);
                }
            },
            fbqCustom: (event: string, data?: any) => {
                if (import.meta.client && initialized && window.fbq) {
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
