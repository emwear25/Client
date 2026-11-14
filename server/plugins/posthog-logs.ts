import { initializePostHogLogs, shutdownPostHogLogs } from "../utils/posthog-logs";

export default defineNitroPlugin((nitroApp) => {
  const { public: publicConfig } = useRuntimeConfig();

  initializePostHogLogs({
    host: publicConfig.posthog.host,
    projectToken: publicConfig.posthog.projectToken,
  });

  nitroApp.hooks.hookOnce("close", shutdownPostHogLogs);
});
