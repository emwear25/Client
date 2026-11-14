/**
 * Cloudinary delivery helpers.
 *
 * Product images are uploaded to Cloudinary as large PNGs (~800 KB).
 * Inserting a transformation after `/upload/` makes Cloudinary resize them
 * and serve AVIF/WebP (f_auto) at an automatic quality (q_auto), typically
 * 20–60 KB for a product card. Non-Cloudinary URLs are returned unchanged.
 */

const CLOUDINARY_UPLOAD_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export interface CloudinaryOptions {
  width?: number | string;
  height?: number | string;
  /** "limit" keeps the aspect ratio (default); "fill" crops to width×height */
  crop?: "limit" | "fill" | "pad";
  /** f_auto by default; use "jpg" for og:image / feeds that need a fixed format */
  format?: "auto" | "jpg" | "webp";
}

export function cloudinaryUrl(src: string | null | undefined, opts: CloudinaryOptions = {}): string {
  if (!src) return "";
  const match = src.match(CLOUDINARY_UPLOAD_RE);
  if (!match) return src;

  const base = match[1] ?? "";
  const rest = match[2] ?? "";
  // Already transformed (first path segment holds transformations) - leave it
  if (/^(?:[a-z]{1,3}_[^/,]+,?)+\//.test(rest) && !/^v\d+\//.test(rest)) return src;

  const parts = [`f_${opts.format || "auto"}`, "q_auto", `c_${opts.crop || "limit"}`];
  const w = Number(opts.width);
  const h = Number(opts.height);
  if (w > 0) parts.push(`w_${Math.round(w)}`);
  if (h > 0 && opts.crop && opts.crop !== "limit") parts.push(`h_${Math.round(h)}`);
  return `${base}${parts.join(",")}/${rest}`;
}
