/**
 * Cookie Consent Composable (GDPR)
 *
 * Single source of truth for cookie consent state:
 * - Stores the visitor's choice in a first-party cookie for 12 months
 *   (with a version so changing categories re-asks for consent)
 * - Applies consent to Google Analytics via Google Consent Mode v2
 *   (gtag loads only after analytics consent - initMode: "manual")
 * - Notifies the Facebook Pixel plugin through a window event
 */

export interface ConsentCategories {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

interface StoredConsent {
  version: number;
  timestamp: string;
  categories: ConsentCategories;
}

export const CONSENT_COOKIE_NAME = "emwear-cookie-consent";
export const CONSENT_EVENT = "emwear:cookie-consent";
// Bump when consent categories change to re-ask visitors
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 12 months

export function useCookieConsent() {
  const consentCookie = useCookie<StoredConsent | null>(CONSENT_COOKIE_NAME, {
    maxAge: CONSENT_MAX_AGE,
    sameSite: "lax",
    secure: true,
    default: () => null,
  });

  const isBannerVisible = useState("cookie-consent-banner", () => false);
  const isSettingsOpen = useState("cookie-consent-settings", () => false);
  const gtagInitialized = useState("cookie-consent-gtag-init", () => false);

  // Capture in setup context - applyConsent may run from event handlers
  // where Nuxt composables are not available
  const { gtag, initialize } = useGtag();

  const hasValidConsent = computed(
    () => consentCookie.value !== null && consentCookie.value.version === CONSENT_VERSION
  );

  const categories = computed<ConsentCategories>(() => ({
    necessary: true,
    analytics: consentCookie.value?.categories?.analytics ?? false,
    marketing: consentCookie.value?.categories?.marketing ?? false,
  }));

  /**
   * Apply the consent decision to tracking scripts.
   * Safe to call multiple times (e.g. on page load for returning visitors).
   */
  const applyConsent = (cats: ConsentCategories) => {
    if (!import.meta.client) return;

    // --- Google Analytics (Consent Mode v2) ---
    try {
      if (cats.analytics && !gtagInitialized.value) {
        initialize();
        gtagInitialized.value = true;
      }

      // Update consent state (defaults are "denied" via initCommands)
      if (gtagInitialized.value) {
        gtag("consent", "update", {
          analytics_storage: cats.analytics ? "granted" : "denied",
          ad_storage: cats.marketing ? "granted" : "denied",
          ad_user_data: cats.marketing ? "granted" : "denied",
          ad_personalization: cats.marketing ? "granted" : "denied",
        });
      }
    } catch (error) {
      console.error("[CookieConsent] Failed to apply gtag consent:", error);
    }

    // --- Facebook Pixel (handled in plugins/facebook-pixel.client.ts) ---
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: cats }));
  };

  const saveConsent = (cats: ConsentCategories) => {
    consentCookie.value = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories: cats,
    };
    isBannerVisible.value = false;
    isSettingsOpen.value = false;
    applyConsent(cats);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  /** Show the banner if the visitor has not decided yet (call on mount) */
  const initConsent = () => {
    if (!import.meta.client) return;
    if (hasValidConsent.value) {
      // Returning visitor - re-apply the stored decision
      applyConsent(categories.value);
    } else {
      isBannerVisible.value = true;
    }
  };

  const openSettings = () => {
    isSettingsOpen.value = true;
  };

  const closeSettings = () => {
    isSettingsOpen.value = false;
  };

  return {
    categories,
    hasValidConsent,
    isBannerVisible,
    isSettingsOpen,
    initConsent,
    acceptAll,
    rejectAll,
    saveConsent,
    openSettings,
    closeSettings,
  };
}
