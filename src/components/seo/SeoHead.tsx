
import { Helmet } from "react-helmet";
import BasicMetaTags from "./BasicMetaTags";
import SocialMetaTags from "./SocialMetaTags";
import GeoMobileTags from "./GeoMobileTags";
import StructuredData from "./StructuredData";

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  structuredData?: object;
  noindex?: boolean;
  language?: string;
  favicon?: string;
  alternateLanguages?: {
    lang: string;
    url: string;
  }[];
  openGraphType?: string;
  twitterCard?: string;
  contentType?: string;
  geoRegion?: string;
  geoPlaceName?: string;
  primaryKeywords?: string[];
  secondaryKeywords?: string[];
  longTailKeywords?: string[];
  keywordDensity?: number;
}

const SeoHead = ({
  title = "Quwik - Buy & Sell Locally",
  description = "Discover the best local deals on Quwik. Buy and sell items locally - mobiles, electronics, cars, bikes, furniture and more. Safe and secure marketplace.",
  keywords = [
    "buy and sell",
    "local marketplace",
    "online classifieds",
    "used items",
    "second hand",
    "mobile phones",
    "cars",
    "bikes",
    "electronics",
    "furniture",
    "real estate",
    "jobs",
    "services",
    "local deals",
    "nearby classifieds",
    "safe trading",
    "secure marketplace",
    "online shopping",
    "local shopping",
    "best deals"
  ],
  primaryKeywords = ["marketplace", "classifieds", "buy and sell", "local shopping"],
  secondaryKeywords = ["used items", "second hand goods", "preloved items"],
  longTailKeywords = [
    "best place to buy used electronics near me",
    "how to sell second hand furniture online",
    "affordable pre-owned vehicles in my area"
  ],
  image = "/og-image.png",
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = "website",
  canonical = typeof window !== 'undefined' ? window.location.href : '',
  author = "Quwik Marketplace",
  publishedAt,
  modifiedAt,
  structuredData,
  noindex = false,
  language = "en",
  favicon = "/favicon.ico",
  alternateLanguages = [],
  openGraphType = "website",
  twitterCard = "summary_large_image",
  contentType = "text/html; charset=utf-8",
  geoRegion = "IN",
  geoPlaceName = "India",
  keywordDensity = 2
}: SeoHeadProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Combine all keywords for meta tags
  const allKeywords = [...primaryKeywords, ...keywords, ...secondaryKeywords, ...longTailKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];

  return (
    <>
      <BasicMetaTags
        title={title}
        description={description}
        keywords={keywords}
        primaryKeywords={primaryKeywords}
        secondaryKeywords={secondaryKeywords}
        longTailKeywords={longTailKeywords}
        author={author}
        contentType={contentType}
        language={language}
        noindex={noindex}
        favicon={favicon}
      />
      
      <SocialMetaTags
        title={title}
        description={description}
        image={image}
        url={url}
        type={type}
        language={language}
        openGraphType={openGraphType}
        twitterCard={twitterCard}
      />
      
      <GeoMobileTags
        geoRegion={geoRegion}
        geoPlaceName={geoPlaceName}
        alternateLanguages={alternateLanguages}
      />
      
      <StructuredData
        structuredData={structuredData}
        baseUrl={baseUrl}
        uniqueKeywords={uniqueKeywords}
      />
      
      {/* Canonical URL */}
      <Helmet>
        <link rel="canonical" href={canonical} />
        
        {/* Article Published and Modified Dates (for blog posts) */}
        {publishedAt && <meta property="article:published_time" content={publishedAt} />}
        {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      </Helmet>
    </>
  );
};

export default SeoHead;
