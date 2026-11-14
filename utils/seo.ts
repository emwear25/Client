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
 * Strip HTML and Markdown from free text (product descriptions are
 * authored in the dashboard and may contain **bold**, _italics_, lists...)
 */
export function toPlainText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // [label](url) / images
    .replace(/(\*\*|__|\*|_|~~|`)(?=\S)([\s\S]*?\S)\1/g, "$2") // **bold** _it_ `code`
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
    .replace(/[*_`#]{2,}/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate at a word boundary and append an ellipsis (never cut mid-word)
 */
export function truncateAtWord(text: string, maxLength: number, ellipsis = ""): string {
  if (text.length <= maxLength) return text;
  const limit = maxLength - ellipsis.length;
  const cut = text.substring(0, limit + 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > limit * 0.6 ? cut.substring(0, lastSpace) : cut.substring(0, limit);
  return base.replace(/[\s\-–—,;:.!?(]+$/, "") + ellipsis;
}

/**
 * Generate SEO title for a product.
 *
 * "Хавлия с ушички – Еднорог с бродирано име | emWear": the product name
 * plus the main search modifier ("с име") when the name doesn't already
 * say it's personalised and it fits in 60 chars. The category is NOT
 * appended - it used to leak the English slug ("- kids-towels").
 */
export function generateSEOTitle(
  productName: string,
  _category?: string | null,
  customTitle?: string | null
): string {
  const SUFFIX = " | emWear";
  const MAX_LENGTH = 60;

  if (customTitle) {
    const t = customTitle.includes("emWear") ? customTitle : `${customTitle}${SUFFIX}`;
    return t.length <= MAX_LENGTH ? t : `${truncateAtWord(customTitle, MAX_LENGTH - SUFFIX.length)}${SUFFIX}`;
  }

  const name = productName.trim();
  const fits = (t: string) => `${t}${SUFFIX}`.length <= MAX_LENGTH;
  const isPersonal = (t: string) => /(име|персонализ|надпис)/i.test(t);

  // The distinguishing part of a name is at the END ("… (оранжев)"), so
  // when it's too long drop the generic "Персонализиран(а/о)" prefix
  // instead of cutting the end (that produced duplicate titles).
  const stripped = name.replace(/^персонализиран[аио]?\s+/i, "");
  const short = stripped.charAt(0).toUpperCase() + stripped.slice(1);

  const candidates: string[] = [];
  for (const base of short === name ? [name] : [name, short]) {
    if (!isPersonal(base)) candidates.push(`${base} с бродирано име`, `${base} с име`);
    candidates.push(base);
  }
  const chosen = candidates.find(fits);
  if (chosen) return `${chosen}${SUFFIX}`;
  return `${truncateAtWord(short, MAX_LENGTH - SUFFIX.length)}${SUFFIX}`;
}

/**
 * Generate meta description (≤160 chars, plain text, word-boundary cut)
 */
export function generateMetaDescription(
  description: string,
  customDescription?: string | null,
  productName?: string | null
): string {
  const MAX = 160;
  const custom = toPlainText(customDescription);
  if (custom) return truncateAtWord(custom, MAX, "…");

  let metaDesc = toPlainText(description);

  // Colour/variant products often share one description. Lead with the
  // variant part of the name ("Кученце (сиво)") when the text doesn't
  // mention it, so every page gets a unique snippet.
  const variant = productName?.split(/\s[–—-]\s/).slice(1).join(" – ").trim();
  if (metaDesc && variant && !metaDesc.toLowerCase().includes(variant.toLowerCase())) {
    metaDesc = `${variant} – ${metaDesc}`;
  }
  if (!metaDesc) {
    return "Персонализирано изделие с бродирано име от emWear. Изработка за 1–2 работни дни, доставка в цяла България.";
  }

  // Pad short descriptions with the key selling points
  if (metaDesc.length < 110) {
    metaDesc = `${metaDesc.replace(/[.!]?$/, ".")} Изработка за 1–2 дни, доставка в цяла България.`;
  }

  return truncateAtWord(metaDesc, MAX, "…");
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
  const baseUrl = config.public.frontendUrl || "https://www.emwear.bg";
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
  description: "Персонализирани подаръци с качествена бродерия. Детски раници, торби, чанти с име. Безплатна доставка над €80.",
  tagline: "Персонализирани подаръци с грижа и стил",
  locale: "bg_BG",
  siteUrl: "https://www.emwear.bg",
};


