/**
 * Campaign attribution (see utils/attribution.ts): records UTM tags from the
 * landing URL and later navigations, respecting analytics consent.
 */
import { CONSENT_COOKIE_NAME, CONSENT_EVENT } from "~/composables/useCookieConsent";
import type { ConsentCategories } from "~/composables/useCookieConsent";
import { onAttributionConsent, recordTouch, touchFromUrl } from "~/utils/attribution";

export default defineNuxtPlugin((nuxtApp) => {
  const consentCookie = useCookie<{ categories?: ConsentCategories } | null>(CONSENT_COOKIE_NAME, {
    default: () => null,
  });
  let hasConsent = consentCookie.value?.categories?.analytics === true;

  recordTouch(touchFromUrl(new URL(window.location.href)), hasConsent);

  nuxtApp.$router.afterEach((to) => {
    if (Object.keys(to.query).some((k) => k.startsWith("utm_"))) {
      recordTouch(touchFromUrl(new URL(to.fullPath, window.location.origin)), hasConsent);
    }
  });

  window.addEventListener(CONSENT_EVENT, (event: Event) => {
    hasConsent = (event as CustomEvent<ConsentCategories>).detail?.analytics === true;
    onAttributionConsent(hasConsent);
  });
});
