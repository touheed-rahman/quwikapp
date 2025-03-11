
import { Helmet } from "react-helmet";

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
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Combine all keywords for meta tags
  const allKeywords = [...primaryKeywords, ...keywords, ...secondaryKeywords, ...longTailKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];

  // Default Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Quwik",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "sameAs": [
      "https://www.facebook.com/quwik",
      "https://twitter.com/quwik",
      "https://www.instagram.com/quwik"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@quwik.com"
    },
    "keywords": uniqueKeywords.join(", ")
  };

  // Default Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Quwik",
    "url": baseUrl,
    "description": description,
    "keywords": uniqueKeywords.join(", "),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Default Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  };

  // Use provided structured data or defaults
  const schemaData = structuredData || {
    organization: organizationSchema,
    website: websiteSchema,
    breadcrumb: breadcrumbSchema
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
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
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Favicon */}
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href="/logo192.png" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={openGraphType} />
      <meta property="og:site_name" content="Quwik" />
      <meta property="og:locale" content={language} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@quwik" />
      <meta name="twitter:creator" content="@quwik" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Geo Meta Tags */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlaceName} />
      <meta name="geo.position" content="28.6139;77.2090" />
      <meta name="ICBM" content="28.6139, 77.2090" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Article Published and Modified Dates (for blog posts) */}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      
      {/* Mobile App Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Quwik" />
      <meta name="application-name" content="Quwik" />
      
      {/* Alternate Languages */}
      {alternateLanguages.map((alt) => (
        <link rel="alternate" hrefLang={alt.lang} href={alt.url} key={alt.lang} />
      ))}
      
      {/* Structured Data / Schema.org */}
      {Object.values(schemaData).map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
