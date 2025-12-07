/**
 * Breadcrumb Composable
 * Generates breadcrumb structured data for SEO
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate breadcrumb structured data
 */
export function useBreadcrumbs(items: BreadcrumbItem[]) {
  const config = useRuntimeConfig();
  const siteUrl = config.public.frontendUrl || "https://emwear.bg";

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbList),
      },
    ],
  });
}
