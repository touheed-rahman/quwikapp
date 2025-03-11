
import React from 'react';

interface KeywordRichTextProps {
  text: string;
  keywords?: string[];
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  highlight?: boolean;
}

/**
 * KeywordRichText component intelligently marks up text with semantic HTML
 * to help search engines understand the importance of certain keywords
 */
const KeywordRichText: React.FC<KeywordRichTextProps> = ({
  text,
  keywords = [],
  headingLevel,
  className = "",
  highlight = false
}) => {
  // Don't process if no keywords or text
  if (!keywords.length || !text) {
    if (headingLevel) {
      const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
      return <HeadingTag className={className}>{text}</HeadingTag>;
    }
    return <p className={className}>{text}</p>;
  }

  // Process text to highlight keywords (but don't overdo it for SEO)
  // We'll emphasize only the first 2-3 occurrences of each keyword
  const processedText = React.useMemo(() => {
    // Create a map to track how many times each keyword has been emphasized
    const keywordCounts: Record<string, number> = {};
    keywords.forEach(keyword => { keywordCounts[keyword.toLowerCase()] = 0 });
    
    // Only emphasize if we're in highlight mode
    if (!highlight) return text;
    
    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    
    let result = text;
    
    // Replace keywords with emphasized versions (max 2 times per keyword)
    sortedKeywords.forEach(keyword => {
      if (!keyword.trim()) return;
      
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      let match;
      let tempResult = result;
      let lastIndex = 0;
      let replacements = 0;
      let newResult = '';
      
      // Loop through matches to control how many we replace
      while ((match = regex.exec(tempResult)) !== null && replacements < 2) {
        // Avoid emphasizing keywords that are already in HTML tags
        const beforeMatch = tempResult.substring(0, match.index);
        const openTags = (beforeMatch.match(/<[^\/]/g) || []).length;
        const closeTags = (beforeMatch.match(/<\//g) || []).length;
        
        // Only emphasize if we're not inside a tag
        if (openTags === closeTags) {
          newResult += tempResult.substring(lastIndex, match.index);
          newResult += `<em class="keyword">${match[0]}</em>`;
          lastIndex = match.index + match[0].length;
          replacements++;
        } else {
          newResult += tempResult.substring(lastIndex, match.index + match[0].length);
          lastIndex = match.index + match[0].length;
        }
      }
      
      // Add any remaining text
      newResult += tempResult.substring(lastIndex);
      result = newResult;
    });
    
    return result;
  }, [text, keywords, highlight]);

  // Render as heading or paragraph
  if (headingLevel) {
    const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
    return <HeadingTag className={className} dangerouslySetInnerHTML={{ __html: processedText }} />;
  }
  
  return <p className={className} dangerouslySetInnerHTML={{ __html: processedText }} />;
};

export default KeywordRichText;
