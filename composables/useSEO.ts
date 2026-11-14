/**
 * SEO Composable
 *
 * All head entries are keyed and driven by computed values, so calling
 * these composables once per page (with a getter for async data) keeps the
 * tags in sync without duplicating them. Do NOT call them inside
 * watch/watchEffect - every call creates a new head entry.
 */

import type { MaybeRefOrGetter } from "vue";
import { cloudinaryUrl } from "~/utils/image";
import { toValue } from "vue";
import {
  generateSEOTitle,
  generateMetaDescription,
  toPlainText,
  truncateAtWord,
  SOCIAL_LINKS,
  SITE_METADATA,
} from "~/utils/seo";

export interface ProductSEO {
  name: string;
  description: string;
  images?: Array<{ url: string; alt?: string }>;
  price?: number;
  priceCurrency?: string;
  stock?: number;
  category?: string | { name: string; displayName?: string; slug?: string };
  seoTitle?: string | null;
  metaDescription?: string | null;
  slug?: string;
  sku?: string;
  /** true when the item is made to order with the customer's text */
  personalized?: boolean;
  reviewStats?: {
    averageRating?: number;
    totalReviews?: number;
  };
}

export interface PageSEO {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
  /** override the canonical path (defaults to the current route path) */
  path?: string;
}

const BRAND_SUFFIX = " | emWear";

/**
 * Resolve the site origin ONCE during setup. Head getters/computeds run
 * later, outside the Nuxt context, where useRuntimeConfig() throws.
 */
function useSiteUrl(): string {
  const config = useRuntimeConfig();
  return ((config.public.frontendUrl as string) || SITE_METADATA.siteUrl).replace(/\/$/, "");
}

function absoluteUrl(siteUrl: string, url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? `${siteUrl}${url}` : `${siteUrl}/${url}`;
}

/** Self-referencing canonical + hreflang (single-language site) */
function canonicalLinks(url: string) {
  return [
    { key: "canonical", rel: "canonical", href: url },
    { key: "hreflang-bg", rel: "alternate", hreflang: "bg", href: url },
    { key: "hreflang-x-default", rel: "alternate", hreflang: "x-default", href: url },
  ];
}

/**
 * Set SEO meta tags for a page.
 * Accepts a plain object or a getter/computed for data loaded asynchronously.
 */
export function usePageSEO(input: MaybeRefOrGetter<PageSEO | null | undefined>) {
  const route = useRoute();
  const siteUrl = useSiteUrl();

  const data = computed(() => {
    const options = toValue(input);
    if (!options) return null;

    const title = options.title.includes("emWear") ? options.title : `${options.title}${BRAND_SUFFIX}`;
    const description = truncateAtWord(toPlainText(options.description), 160, "…");
    const url = `${siteUrl}${options.path || route.path}`;
    const image =
      cloudinaryUrl(absoluteUrl(siteUrl, options.image), { width: 1200, format: "jpg" }) ||
      `${siteUrl}/emwear-front-page.png`;
    return { ...options, title, description, url, image };
  });

  useHead(() => {
    const d = data.value;
    if (!d) return {};
    return {
      title: d.title,
      // Title already contains the brand - disable the global titleTemplate
      titleTemplate: null,
      meta: [
        { key: "description", name: "description", content: d.description },
        {
          key: "robots",
          name: "robots",
          content: d.noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
        },
        { key: "og:title", property: "og:title", content: d.title },
        { key: "og:description", property: "og:description", content: d.description },
        { key: "og:image", property: "og:image", content: d.image },
        { key: "og:url", property: "og:url", content: d.url },
        { key: "og:type", property: "og:type", content: d.type || "website" },
        { key: "og:site_name", property: "og:site_name", content: SITE_METADATA.name },
        { key: "og:locale", property: "og:locale", content: SITE_METADATA.locale },
        { key: "twitter:card", name: "twitter:card", content: "summary_large_image" },
        { key: "twitter:title", name: "twitter:title", content: d.title },
        { key: "twitter:description", name: "twitter:description", content: d.description },
        { key: "twitter:image", name: "twitter:image", content: d.image },
        ...(d.type === "article"
          ? [{ key: "article:publisher", property: "article:publisher", content: SOCIAL_LINKS.facebook }]
          : []),
      ],
      link: canonicalLinks(d.url),
    };
  });
}

/**
 * Set SEO meta tags + Product JSON-LD for a product page.
 * Pass a getter so price/stock/reviews stay in sync with the selected variant.
 */
export function useProductSEO(input: MaybeRefOrGetter<ProductSEO | null | undefined>) {
  const route = useRoute();
  const siteUrl = useSiteUrl();

  const data = computed(() => {
    const product = toValue(input);
    if (!product) return null;

    const priceCurrency = product.priceCurrency || "EUR";
    const category = product.category;
    const categoryName =
      typeof category === "object" && category
        ? category.displayName || category.name
        : category || undefined;

    const cleanDescription = toPlainText(product.description);
    const title = generateSEOTitle(product.name, categoryName, product.seoTitle || null);
    const description = generateMetaDescription(cleanDescription, product.metaDescription || null, product.name);

    const routeSlug = route.params.slug || route.params.id;
    const slug = product.slug || (Array.isArray(routeSlug) ? routeSlug[0] : routeSlug) || "";
    const url = `${siteUrl}/products/${slug}`;

    const images = (product.images || [])
      .map((img) => absoluteUrl(siteUrl, img.url))
      .filter((u): u is string => Boolean(u));
    // Social previews: 1200px JPG (not every crawler accepts AVIF/WebP);
    // the originals are ~800 KB PNGs
    const image = images[0] ? cloudinaryUrl(images[0], { width: 1200, format: "jpg" }) : `${siteUrl}/emwear-front-page.png`;

    const inStock =
      typeof product.stock === "number" ? product.stock > 0 : Boolean(product.price && product.price > 0);
    const availability = inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

    // Matches /shipping: personalised items can't be returned (only
    // defects / our mistakes are replaced); other items: 14 days, paid
    // by the customer.
    const returnPolicy = product.personalized !== false
      ? {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "BG",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        }
      : {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "BG",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 14,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        };

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      name: product.name,
      description: truncateAtWord(cleanDescription, 500) || `Персонализиран ${product.name} от emWear`,
      image: images.length ? images.map((u) => cloudinaryUrl(u, { width: 1600, format: "jpg" })) : [image],
      url,
      brand: { "@type": "Brand", name: "emWear" },
      ...(product.sku ? { sku: product.sku } : {}),
      ...(categoryName ? { category: categoryName } : {}),
      offers: {
        "@type": "Offer",
        url,
        price: Number((product.price || 0).toFixed(2)),
        priceCurrency,
        availability,
        itemCondition: "https://schema.org/NewCondition",
        priceValidUntil: nextYear.toISOString().split("T")[0],
        seller: { "@id": `${siteUrl}/#organization` },
        hasMerchantReturnPolicy: returnPolicy,
      },
    };

    const reviews = product.reviewStats;
    if (reviews?.totalReviews && reviews.totalReviews > 0 && reviews.averageRating) {
      structuredData.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(reviews.averageRating.toFixed(1)),
        reviewCount: reviews.totalReviews,
        bestRating: 5,
        worstRating: 1,
      };
    }

    return { title, description, url, image, priceCurrency, product, structuredData };
  });

  useHead(() => {
    const d = data.value;
    if (!d) return {};
    return {
      title: d.title,
      titleTemplate: null,
      meta: [
        { key: "description", name: "description", content: d.description },
        { key: "robots", name: "robots", content: "index, follow, max-image-preview:large" },
        { key: "og:title", property: "og:title", content: d.title },
        { key: "og:description", property: "og:description", content: d.description },
        { key: "og:image", property: "og:image", content: d.image },
        { key: "og:url", property: "og:url", content: d.url },
        { key: "og:type", property: "og:type", content: "product" },
        { key: "og:site_name", property: "og:site_name", content: SITE_METADATA.name },
        { key: "og:locale", property: "og:locale", content: SITE_METADATA.locale },
        { key: "product:price:amount", property: "product:price:amount", content: (d.product.price || 0).toFixed(2) },
        { key: "product:price:currency", property: "product:price:currency", content: d.priceCurrency },
        { key: "twitter:card", name: "twitter:card", content: "summary_large_image" },
        { key: "twitter:title", name: "twitter:title", content: d.title },
        { key: "twitter:description", name: "twitter:description", content: d.description },
        { key: "twitter:image", name: "twitter:image", content: d.image },
      ],
      link: canonicalLinks(d.url),
      script: [
        {
          key: "ld-product",
          type: "application/ld+json",
          innerHTML: JSON.stringify(d.structuredData),
        },
      ],
    };
  });
}

/**
 * Set default site-wide SEO (non-overriding)
 */
export function useDefaultSEO() {
  useHead({
    htmlAttrs: {
      lang: "bg",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" },
    ],
  });
}
