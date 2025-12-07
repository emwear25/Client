/**
 * SEO Composable
 * Provides SEO utilities and default meta tags
 */

import { generateSEOTitle, generateMetaDescription, getFullUrl, SOCIAL_LINKS, SITE_METADATA } from "~/utils/seo";

export interface ProductSEO {
  name: string;
  description: string;
  images?: Array<{ url: string; alt?: string }>;
  price?: number;
  category?: string | { name: string };
  seoTitle?: string | null;
  metaDescription?: string | null;
  slug?: string;
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
}

/**
 * Set SEO meta tags for a page
 */
export function usePageSEO(options: PageSEO) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.frontendUrl || SITE_METADATA.siteUrl;
  const currentUrl = getFullUrl(route.path);

  // Generate title
  const title = options.title.includes("|") ? options.title : `${options.title} | emWear`;

  // Generate description
  const description =
    options.description.length > 160
      ? options.description.substring(0, 157) + "..."
      : options.description;

  // Default image - handle both relative and absolute URLs
  let ogImage = options.image || `${siteUrl}/logo.png`;
  if (options.image && !options.image.startsWith("http")) {
    ogImage = options.image.startsWith("/") ? `${siteUrl}${options.image}` : `${siteUrl}/${options.image}`;
  }

  // Set meta tags
  useHead({
    title,
    meta: [
      // Basic meta
      {
        name: "description",
        content: description,
      },
      {
        name: "robots",
        content: options.noindex ? "noindex, nofollow" : "index, follow",
      },

      // Open Graph
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:image",
        content: ogImage,
      },
      {
        property: "og:url",
        content: currentUrl,
      },
      {
        property: "og:type",
        content: options.type || "website",
      },
      {
        property: "og:site_name",
        content: SITE_METADATA.name,
      },
      {
        property: "og:locale",
        content: SITE_METADATA.locale,
      },
      // Social media links
      {
        property: "og:see_also",
        content: SOCIAL_LINKS.facebook,
      },
      {
        property: "article:author",
        content: SOCIAL_LINKS.facebook,
      },

      // Twitter Card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        name: "twitter:image",
        content: ogImage,
      },
      {
        name: "twitter:site",
        content: "@emwear",
      },
    ],

    link: [
      {
        rel: "canonical",
        href: currentUrl,
      },
    ],
  });
}

/**
 * Set SEO meta tags for a product page
 */
export function useProductSEO(product: ProductSEO) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.frontendUrl || SITE_METADATA.siteUrl;

  // Get category name
  const categoryName =
    typeof product.category === "object" ? product.category?.name : product.category;

  // Generate SEO data
  const seoTitle = generateSEOTitle(product.name, categoryName, product.seoTitle || null);
  const metaDescription = generateMetaDescription(
    product.description,
    product.metaDescription || null
  );

  // Product URL
  const productSlug = product.slug || route.params.id;
  const productUrl = getFullUrl(`/products/${productSlug}`);

  // Product image - handle both relative and absolute URLs (Cloudinary)
  let productImage = `${siteUrl}/logo.png`;
  if (product.images?.[0]?.url) {
    productImage = product.images[0].url.startsWith("http")
      ? product.images[0].url
      : product.images[0].url.startsWith("/")
        ? `${siteUrl}${product.images[0].url}`
        : `${siteUrl}/${product.images[0].url}`;
  }

  // Set meta tags
  useHead({
    title: seoTitle,
    meta: [
      {
        name: "description",
        content: metaDescription,
      },
      {
        property: "og:title",
        content: seoTitle,
      },
      {
        property: "og:description",
        content: metaDescription,
      },
      {
        property: "og:image",
        content: productImage,
      },
      {
        property: "og:url",
        content: productUrl,
      },
      {
        property: "og:type",
        content: "product",
      },
      {
        property: "og:site_name",
        content: SITE_METADATA.name,
      },
      {
        property: "product:price:amount",
        content: product.price?.toString() || "",
      },
      {
        property: "product:price:currency",
        content: "BGN",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: seoTitle,
      },
      {
        name: "twitter:description",
        content: metaDescription,
      },
      {
        name: "twitter:image",
        content: productImage,
      },
      {
        name: "twitter:site",
        content: "@emwear",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: productUrl,
      },
    ],
  });

  // Add structured data (JSON-LD)
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image:
      product.images?.map((img) => {
        // Handle both relative and absolute URLs
        if (img.url.startsWith("http")) return img.url;
        return img.url.startsWith("/") ? `${siteUrl}${img.url}` : `${siteUrl}/${img.url}`;
      }) || [productImage],
    brand: {
      "@type": "Brand",
      name: "emWear",
    },
    offers: {
      "@type": "Offer",
      price: product.price || 0,
      priceCurrency: "BGN",
      availability:
        product.price && product.price > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: productUrl,
    },
  };

  // Add category if available
  if (categoryName) {
    structuredData.category = categoryName;
  }

  // Add reviews if available
  if (product.reviewStats && product.reviewStats.totalReviews > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.reviewStats.averageRating,
      reviewCount: product.reviewStats.totalReviews,
    };
  }

  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  });
}

/**
 * Set default site-wide SEO (non-overriding)
 * This sets base meta that won't conflict with page-specific SEO
 */
export function useDefaultSEO() {
  useHead({
    htmlAttrs: {
      lang: "bg",
    },
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "format-detection",
        content: "telephone=no",
      },
    ],
  });
}


