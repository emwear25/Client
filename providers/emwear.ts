/**
 * Default <NuxtImg> provider.
 *
 * - Cloudinary URLs: resized + f_auto/q_auto by Cloudinary's CDN (with a
 *   proper srcset when `sizes` is set on the component).
 * - Everything else (local /img/... files): served as-is, which is what the
 *   previous ipx setup effectively did for these URLs.
 */
import type { ProviderGetImage } from "@nuxt/image";
import { cloudinaryUrl } from "../utils/image";

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  return {
    url: cloudinaryUrl(src, { width: modifiers.width, height: modifiers.height }),
  };
};
