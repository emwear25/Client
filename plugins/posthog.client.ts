/**
 * PostHog product analytics (EU cloud).
 *
 * Owner decision (2026-11-14): PostHog runs for ALL visitors, independent of
 * the cookie banner. NOTE: this does not follow the consent-first approach
 * used for Google Analytics / Meta Pixel - revisit if GDPR compliance is
 * required (PostHog supports cookieless mode: persistence "memory").
 *
 * Privacy safeguards that stay on regardless:
 * - Session replay masks every input field (names, phones, addresses, cards)
 * - Text on checkout / order / account pages is masked in recordings
 * - Data is stored in the EU region
 */
import posthog from "posthog-js";
import { watch } from "vue";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const key = config.public.posthogKey as string;
  if (!key) return { provide: { posthog: null as typeof posthog | null } };

  posthog.init(key, {
    api_host: (config.public.posthogHost as string) || "https://eu.i.posthog.com",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    // SPA navigation: capture $pageview / $pageleave on every route change
    capture_pageview: "history_change",
    capture_pageleave: true,
    // Only build person profiles for identified (logged-in) users - cheaper
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
      // Personal data shown as text (addresses, order details, account info)
      maskTextSelector:
        ".checkout, .order-success, .profile-page, .profile-edit-page, .orders-page, .auth-page, [data-ph-mask]",
    },
    loaded: (ph) => {
      if (import.meta.dev) ph.debug(false);
    },
  });

  // Link logged-in customers to their PostHog profile (only the customer id
  // is sent - no name, email or phone), and unlink on logout
  const auth = useAuthStore();
  watch(
    () => auth.user?._id,
    (id, previousId) => {
      if (id) posthog.identify(String(id));
      else if (previousId) posthog.reset();
    },
    { immediate: true }
  );

  // Make Vue errors visible in PostHog error tracking
  nuxtApp.hook("vue:error", (error) => {
    posthog.captureException(error);
  });

  return { provide: { posthog } };
});
