/**
 * SEO Utility Functions
 * Auto-generates SEO metadata from product/page data
 */

export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  category?: string;
}

/**
 * Generate SEO title from product name
 */
export function generateSEOTitle(
  productName: string,
  category?: string | null,
  customTitle?: string | null
): string {
  // Use custom title if provided
  if (customTitle) {
    return customTitle.length > 60 ? customTitle.substring(0, 57) + "..." : customTitle;
  }

  // Build title
  let title = productName;
  if (category) {
    title = `${productName} - ${category}`;
  }
  title = `${title} | emWear`;

  // Ensure max 60 characters
  if (title.length > 60) {
    title = title.substring(0, 57) + "...";
  }

  return title;
}

/**
 * Generate meta description from product description
 */
export function generateMetaDescription(
  description: string,
  customDescription?: string | null
): string {
  // Use custom description if provided
  if (customDescription) {
    return customDescription.length > 160
      ? customDescription.substring(0, 157) + "..."
      : customDescription;
  }

  // Auto-generate from description
  let metaDesc = description.substring(0, 155).trim();

  // If description is too short, add key info
  if (metaDesc.length < 100) {
    metaDesc += " Безплатна доставка над 110 лв.";
  }

  metaDesc += " | emWear";

  // Ensure max 160 characters
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + "...";
  }

  return metaDesc;
}

/**
 * Generate image alt text
 */
export function generateImageAlt(
  productName: string,
  imageIndex: number = 0,
  customAlt?: string | null
): string {
  if (customAlt) return customAlt;

  const positions = ["Главна снимка", "Снимка 2", "Снимка 3", "Снимка 4", "Снимка 5"];
  return `${productName} - ${positions[imageIndex] || `Снимка ${imageIndex + 1}`}`;
}

/**
 * Get full URL for a path
 */
export function getFullUrl(path: string): string {
  const config = useRuntimeConfig();
  const baseUrl = config.public.frontendUrl || "https://emwear.bg";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Social media links (from footer)
 */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/emwearbg/",
  instagram: "https://www.instagram.com/emwea.r/",
  tiktok: "https://www.tiktok.com/@emwear.bg",
};

/**
 * Default site metadata
 */
export const SITE_METADATA = {
  name: "emWear",
  description: "Персонализирани подаръци с качествена бродерия. Детски раници, торби, чанти с име. Безплатна доставка над 110 лв.",
  tagline: "Персонализирани подаръци с грижа и стил",
  locale: "bg_BG",
  siteUrl: "https://emwear.bg",
};


