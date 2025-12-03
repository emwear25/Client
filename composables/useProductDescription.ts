/**
 * Utility composable for formatting product descriptions
 * Converts plain text with line breaks to nicely formatted HTML
 */

export const useProductDescription = () => {
  /**
   * Format product description text with basic formatting support
   * - Converts double line breaks to separate paragraphs
   * - Converts single line breaks to <br> tags
   * - Preserves text formatting
   */
  const formatDescription = (text: string): string => {
    if (!text) return "";

    // First escape HTML to prevent XSS
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Split by double line breaks to create paragraphs
    const paragraphs = formatted.split(/\n\s*\n/).filter((p) => p.trim());

    if (paragraphs.length === 0) return "";

    // If only one paragraph, just add line breaks
    if (paragraphs.length === 1) {
      const withBreaks = paragraphs[0].trim().split(/\n/).join("<br>");
      return `<p>${withBreaks}</p>`;
    }

    // Multiple paragraphs - wrap each in <p> tag
    return paragraphs
      .map((para) => {
        const trimmed = para.trim();
        // Replace single line breaks within paragraph with <br>
        const withBreaks = trimmed.split(/\n/).join("<br>");
        return `<p>${withBreaks}</p>`;
      })
      .join("");
  };

  return {
    formatDescription,
  };
};

