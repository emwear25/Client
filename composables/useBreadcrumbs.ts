/**
 * Breadcrumb Schema Composable
 * Emits BreadcrumbList JSON-LD. Pass a getter for async data; call once
 * per page (not inside a watcher).
 */

import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function useBreadcrumbs(input: MaybeRefOrGetter<BreadcrumbItem[] | null | undefined>) {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.frontendUrl as string) || "https://www.emwear.bg";

  useHead(() => {
    const items = toValue(input);
    if (!items?.length) return {};
    return {
      script: [
        {
          key: "ld-breadcrumbs",
          type: "application/ld+json",
          // NOTE: `children` is not rendered by Unhead v2 - use innerHTML
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
            })),
          }),
        },
      ],
    };
  });
}
