
import { Helmet } from "react-helmet";

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
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
  image = "/og-image.png",
  url = window.location.href,
  type = "website"
}: SeoHeadProps) => {
  const baseUrl = window.location.origin;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="canonical" href={url} />
      
      {/* Schema.org Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Quwik",
          "url": baseUrl,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Quwik",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "sameAs": [
            "https://www.facebook.com/quwik",
            "https://twitter.com/quwik",
            "https://www.instagram.com/quwik"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SeoHead;
