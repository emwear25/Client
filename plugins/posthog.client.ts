import posthog from "posthog-js";
import type { PostHog, PostHogInterface } from "posthog-js";

export default defineNuxtPlugin({
  name: "posthog",
  enforce: "pre",
  setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig();
    const { projectToken, host } = runtimeConfig.public.posthog;

    if (!projectToken || !host) {
      if (import.meta.dev) {
        const variableName = !projectToken
          ? "NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
          : "NUXT_PUBLIC_POSTHOG_HOST";
        throw new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
        );
      }

      return { provide: { posthog: undefined } };
    }

    const posthogClient = posthog.init(projectToken, {
      api_host: host,
      loaded: (client: PostHogInterface) => {
        if (import.meta.dev) client.debug();
      },
    });

    nuxtApp.hook("vue:error", (error) => {
      posthogClient.captureException(error);
    });

    return {
      provide: {
        posthog: posthogClient as PostHog,
      },
    };
  },
});
