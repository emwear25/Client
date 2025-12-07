/**
 * Utility composable for formatting product descriptions
 * Converts plain text with or without line breaks to nicely formatted HTML
 * Supports paragraphs, headings, and bullet lists
 */

export const useProductDescription = () => {
  /**
   * Format product description text with enhanced formatting support
   * - Handles text with or without line breaks
   * - Detects headings (words ending with ":")
   * - Converts list items to proper <ul> lists
   * - Splits long text into paragraphs
   */
  const formatDescription = (text: string): string => {
    if (!text) return "";

    // First escape HTML to prevent XSS
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // If text has line breaks, split by them first
    // Otherwise, we'll need to parse it differently
    const hasLineBreaks = formatted.includes("\n");
    
    let result = "";

    if (hasLineBreaks) {
      // Text has line breaks - split by double line breaks for sections
      const sections = formatted.split(/\n\s*\n/).filter((s) => s.trim());
      
      if (sections.length === 0) return "";

      sections.forEach((section) => {
        const lines = section.split(/\n/).map((line) => line.trim()).filter((line) => line);
        
        if (lines.length === 0) return;

        let i = 0;
        while (i < lines.length) {
          const line = lines[i];

          // Check if it's a heading (ends with ":")
          if (line.endsWith(":") && line.length > 1) {
            result += `<h3 class="description-heading">${line}</h3>`;
            i++;

            // Collect list items that follow
            const listItems: string[] = [];
            while (i < lines.length) {
              const nextLine = lines[i];
              
              if (nextLine.endsWith(":") && nextLine.length > 1) {
                break;
              }

              if (nextLine.match(/^[•\-\*]\s/)) {
                const itemText = nextLine.replace(/^[•\-\*]\s+/, "").trim();
                if (itemText) listItems.push(itemText);
              } else if (nextLine && nextLine.length > 0) {
                if (listItems.length > 0 || nextLine.length < 100) {
                  listItems.push(nextLine);
                } else {
                  break;
                }
              } else {
                break;
              }
              i++;
            }

            if (listItems.length >= 2 || listItems.some((item) => item.match(/^[•\-\*]/))) {
              result += "<ul class='description-list'>";
              listItems.forEach((item) => {
                const cleanItem = item.replace(/^[•\-\*]\s+/, "").trim();
                if (cleanItem) {
                  result += `<li>${cleanItem}</li>`;
                }
              });
              result += "</ul>";
            } else if (listItems.length === 1) {
              result += `<p>${listItems[0]}</p>`;
            }
          } else {
            const paragraphLines: string[] = [];
            while (i < lines.length && !lines[i].endsWith(":")) {
              paragraphLines.push(lines[i]);
              i++;
            }

            if (paragraphLines.length > 0) {
              const paragraphText = paragraphLines.join(" ");
              result += `<p>${paragraphText}</p>`;
            } else {
              i++;
            }
          }
        }
      });
    } else {
      // No line breaks - need to parse the text intelligently
      // Look for patterns like "Характеристики:" followed by list items
      
      // First, try to split by common patterns
      // Look for headings (words ending with ":")
      const headingPattern = /([А-Яа-яA-Za-z\s]+:)/g;
      const parts: Array<{ type: 'text' | 'heading'; content: string; index: number }> = [];
      let lastIndex = 0;
      let match;

      while ((match = headingPattern.exec(formatted)) !== null) {
        // Add text before heading
        if (match.index > lastIndex) {
          const textBefore = formatted.substring(lastIndex, match.index).trim();
          if (textBefore) {
            parts.push({ type: 'text', content: textBefore, index: lastIndex });
          }
        }
        
        // Add heading
        parts.push({ type: 'heading', content: match[1], index: match.index });
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < formatted.length) {
        const textAfter = formatted.substring(lastIndex).trim();
        if (textAfter) {
          parts.push({ type: 'text', content: textAfter, index: lastIndex });
        }
      }

      // If no headings found, treat entire text as paragraphs
      if (parts.length === 0) {
        // Split by sentence endings and create paragraphs
        const sentences = formatted.split(/([.!?]\s+)/).filter(s => s.trim());
        let currentParagraph = "";
        
        sentences.forEach((sentence, index) => {
          currentParagraph += sentence;
          // Create new paragraph every 2-3 sentences or at natural breaks
          if ((index + 1) % 3 === 0 || sentence.match(/[.!?]\s*$/)) {
            if (currentParagraph.trim()) {
              result += `<p>${currentParagraph.trim()}</p>`;
              currentParagraph = "";
            }
          }
        });
        
        if (currentParagraph.trim()) {
          result += `<p>${currentParagraph.trim()}</p>`;
        }
      } else {
        // Process parts with headings
        parts.forEach((part, index) => {
          if (part.type === 'heading') {
            result += `<h3 class="description-heading">${part.content}</h3>`;
            
            // Get text after heading (until next part or end)
            const nextPart = parts[index + 1];
            const startIndex = part.index + part.content.length;
            const endIndex = nextPart ? nextPart.index : formatted.length;
            const textAfterHeading = formatted.substring(startIndex, endIndex).trim();
            
            if (textAfterHeading) {
              // For text after headings, try to detect list items
              // List items are typically short phrases starting with capital letters
              // Split by capital Cyrillic letters that start new sentences/phrases
              const listItems: string[] = [];
              
              // More intelligent splitting: look for capital letters that start new phrases
              // but not mid-word capitals
              const splitPattern = /(?=[А-Я][а-я]{2,})/; // Capital followed by 2+ lowercase letters
              const potentialItems = textAfterHeading
                .split(splitPattern)
                .map(item => item.trim())
                .filter(item => {
                  // Filter valid list items
                  const length = item.length;
                  // Should be reasonable length (5-200 chars)
                  // Should start with capital letter
                  // Should not end with sentence punctuation (likely a paragraph)
                  return length >= 5 && 
                         length < 200 && 
                         item.match(/^[А-Я]/) && 
                         !item.match(/[.!?]$/);
                });

              // If we found multiple items, treat as list
              // Also check if text is relatively short overall (likely a list)
              if (potentialItems.length >= 2 || (textAfterHeading.length < 500 && potentialItems.length >= 1)) {
                result += "<ul class='description-list'>";
                potentialItems.forEach((item) => {
                  const cleanItem = item.replace(/^[•\-\*]\s*/, "").trim();
                  if (cleanItem) {
                    result += `<li>${cleanItem}</li>`;
                  }
                });
                result += "</ul>";
              } else {
                // Long text or single item - treat as paragraph
                // But split into sentences for better readability
                const sentences = textAfterHeading.split(/([.!?]\s*)/).filter(s => s.trim());
                let currentParagraph = "";
                
                sentences.forEach((sentence) => {
                  if (sentence.trim()) {
                    currentParagraph += sentence;
                    if (currentParagraph.match(/[.!?]\s*$/) && currentParagraph.length > 80) {
                      result += `<p>${currentParagraph.trim()}</p>`;
                      currentParagraph = "";
                    }
                  }
                });
                
                if (currentParagraph.trim()) {
                  result += `<p>${currentParagraph.trim()}</p>`;
                }
              }
            }
          } else if (part.type === 'text') {
            // Text before a heading - split into paragraphs
            const paragraphText = part.content.trim();
            if (paragraphText) {
              // Split by sentence endings and periods followed by capital letters
              // Handle cases where periods might not have spaces after them
              const sentences = paragraphText
                .replace(/([.!?])([А-Я])/g, '$1 $2') // Add space after period before capital
                .split(/([.!?]\s+)/)
                .filter(s => s.trim());
              
              let currentParagraph = "";
              
              sentences.forEach((sentence) => {
                if (sentence.trim()) {
                  currentParagraph += sentence;
                  // Create paragraph every 2-3 sentences or at natural breaks
                  if (currentParagraph.match(/[.!?]\s*$/) && currentParagraph.length > 100) {
                    result += `<p>${currentParagraph.trim()}</p>`;
                    currentParagraph = "";
                  }
                }
              });
              
              if (currentParagraph.trim()) {
                result += `<p>${currentParagraph.trim()}</p>`;
              }
            }
          }
        });
      }
    }

    return result || `<p>${formatted}</p>`;
  };

  return {
    formatDescription,
  };
};

