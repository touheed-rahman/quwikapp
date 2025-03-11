
import { Helmet } from "react-helmet";

interface StructuredDataProps {
  structuredData: any;
  baseUrl: string;
  uniqueKeywords: string[];
}

const StructuredData = ({ structuredData, baseUrl, uniqueKeywords }: StructuredDataProps) => {
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
    "description": "Discover the best local deals on Quwik",
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
      {/* Structured Data / Schema.org */}
      {Object.values(schemaData).map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;
