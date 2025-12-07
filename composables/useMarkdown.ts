/**
 * Markdown parsing composable using markdown-it
 * Safely converts markdown to HTML with sanitization
 * Client-side only (DOMPurify requires DOM)
 */

// Global instances (initialized once)
let mdInstance: any = null;
let domPurifyInstance: any = null;
let initPromise: Promise<void> | null = null;

const initializeMarkdown = async (): Promise<void> => {
  if (process.server) return;
  if (typeof window === "undefined") return;
  if (mdInstance && domPurifyInstance) return; // Already initialized
  if (initPromise) return initPromise; // Initialization in progress

  initPromise = (async () => {
    try {
      // Import markdown-it
      const markdownItModule = await import("markdown-it");
      const MarkdownIt = markdownItModule.default || markdownItModule;
      
      if (!MarkdownIt) {
        throw new Error("MarkdownIt class not found");
      }
      
      mdInstance = new MarkdownIt({
        html: false,
        breaks: false,
        linkify: true,
        typographer: true,
      });

      // Import DOMPurify
      const domPurifyModule = await import("dompurify");
      domPurifyInstance = domPurifyModule.default || domPurifyModule;
      
      if (!domPurifyInstance) {
        throw new Error("DOMPurify not found");
      }
      
      console.log("✅ Markdown-it and DOMPurify initialized");
    } catch (error) {
      console.error("❌ Error initializing markdown libraries:", error);
      mdInstance = null;
      domPurifyInstance = null;
    }
  })();

  return initPromise;
};

export const useMarkdown = () => {
  const isReady = ref(false);
  
  // Initialize on client side immediately
  if (process.client) {
    if (mdInstance && domPurifyInstance) {
      isReady.value = true;
    } else {
      // Start initialization immediately
      initializeMarkdown().then(() => {
        isReady.value = true;
      }).catch((err) => {
        console.error("Failed to initialize markdown:", err);
      });
    }
  } else {
    // On server, mark as ready (will use escaped text anyway)
    isReady.value = true;
  }

  /**
   * Normalize markdown text - fix common issues and add line breaks where needed
   */
  const normalizeMarkdown = (text: string): string => {
    if (!text) return "";

    let normalized = text;

    // Step 1: Fix malformed headings like "# ##" - keep only the longest one
    normalized = normalized.replace(/(#+)\s+(#+\s+)/g, (match, hash1, hash2Part) => {
      const hash2 = hash2Part.match(/#+/)?.[0] || "";
      const longest = hash1.length >= hash2.length ? hash1 : hash2;
      return longest + " ";
    });

    // Step 2: Add line breaks before headings that are not at the start of a line
    normalized = normalized.replace(/([^\n])(#{1,6}\s+)/g, "$1\n\n$2");

    // Step 3: Fix headings followed immediately by list items on same line
    normalized = normalized.replace(/(#{1,6}[^\n]+)\s+(-\s+)/g, "$1\n\n$2");

    // Step 4: Normalize list items - ensure each "- item" is on its own line
    // First, replace " - " with newline and "- "
    normalized = normalized.replace(/\s+-\s+/g, "\n- ");

    // Step 5: Ensure list items after headings have proper spacing
    normalized = normalized.replace(/(#{1,6}[^\n]+)\n(-)/g, "$1\n\n$2");

    // Step 6: Add line breaks before numbered lists
    normalized = normalized.replace(/([^\n])(\s*\d+\.\s+)/g, "$1\n$2");

    // Step 7: Clean up multiple consecutive line breaks (max 2)
    normalized = normalized.replace(/\n{3,}/g, "\n\n");

    // Step 8: Trim each line but preserve list item format
    normalized = normalized
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        // Preserve list item format
        if (trimmed.startsWith("- ")) {
          return "- " + trimmed.substring(2).trim();
        }
        // Preserve heading format
        if (trimmed.match(/^#{1,6}\s/)) {
          return trimmed;
        }
        return trimmed;
      })
      .filter((line) => line.length > 0) // Remove empty lines
      .join("\n");

    // Step 9: Add blank line before lists that follow headings
    normalized = normalized.replace(/(#{1,6}[^\n]+)\n(-)/g, "$1\n\n$2");

    return normalized.trim();
  };

  /**
   * Parse markdown to HTML with sanitization
   * @param markdown - Markdown text to parse
   * @returns Sanitized HTML string
   */
  const parseMarkdown = (markdown: string): string => {
    if (!markdown) return "";

    // Only run on client side
    if (process.server || typeof window === "undefined") {
      return markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // If libraries aren't initialized yet, return escaped text
    // The component will re-render when isReady becomes true
    if (!mdInstance || !domPurifyInstance) {
      return markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    try {
      // Normalize markdown first
      const normalized = normalizeMarkdown(markdown);

      // Parse markdown to HTML using markdown-it
      const html = mdInstance.render(normalized);

      // Sanitize HTML to prevent XSS attacks
      const sanitized = domPurifyInstance.sanitize(html, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "a",
          "hr",
        ],
        ALLOWED_ATTR: ["href", "title", "target", "rel"],
        ALLOW_DATA_ATTR: false,
      });

      return sanitized;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      // Return escaped text as fallback
      return markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  };

  return {
    parseMarkdown,
    isReady,
  };
};
