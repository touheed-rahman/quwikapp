
import { Helmet } from "react-helmet";

interface BasicMetaTagsProps {
  title: string;
  description: string;
  keywords: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  author: string;
  contentType: string;
  language: string;
  noindex: boolean;
  favicon: string;
}

const BasicMetaTags = ({
  title,
  description,
  keywords,
  primaryKeywords,
  secondaryKeywords,
  longTailKeywords,
  author,
  contentType,
  language,
  noindex,
  favicon
}: BasicMetaTagsProps) => {
  // Combine all keywords for meta tags
  const allKeywords = [...primaryKeywords, ...keywords, ...secondaryKeywords, ...longTailKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];
  
  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={uniqueKeywords.join(', ')} />
      <meta name="author" content={author} />
      <meta http-equiv="Content-Type" content={contentType} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Primary Keywords as Extra Meta Tags for Emphasis */}
      {primaryKeywords.map((keyword, index) => (
        <meta key={`primary-${index}`} name={`keywords:${index+1}`} content={keyword} />
      ))}

      {/* Long-tail Keywords for Voice Search and Question Queries */}
      {longTailKeywords.map((keyword, index) => (
        <meta key={`longtail-${index}`} name={`keyword-phrase:${index+1}`} content={keyword} />
      ))}
      
      {/* Favicon */}
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href="/logo192.png" />
      
      {/* Robots Meta Tag */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
    </Helmet>
  );
};

export default BasicMetaTags;
