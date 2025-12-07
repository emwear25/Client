/**
 * Markdown-it plugin - pre-initialize on client side
 */
export default defineNuxtPlugin(() => {
  // Pre-load markdown-it on client to ensure it's available
  if (process.client) {
    // This ensures the module is available when needed
    import("markdown-it").catch((err) => {
      console.warn("Failed to preload markdown-it:", err);
    });
  }
});
