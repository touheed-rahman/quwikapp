
/**
 * JSON-LD Utility for generating structured data
 */

// Organization
export const generateOrganizationSchema = (baseUrl: string) => {
  return {
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
    }
  };
};

// Product
export const generateProductSchema = (
  id: string,
  title: string,
  description: string,
  price: number,
  condition: string,
  images: string[],
  baseUrl: string,
  brand?: string | null,
  seller?: { id: string, name: string }
) => {
  const productUrl = `${baseUrl}/product/${id}`;
  
  // Map condition to standard schema values
  let itemCondition = "https://schema.org/UsedCondition";
  if (condition === "New") {
    itemCondition = "https://schema.org/NewCondition";
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": description,
    "image": images,
    "sku": `QUWIK-${id.substring(0, 8)}`,
    "mpn": `QUWIK-${id.substring(0, 8)}`,
    "brand": brand ? {
      "@type": "Brand",
      "name": brand
    } : undefined,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": price,
      "itemCondition": itemCondition,
      "availability": "https://schema.org/InStock",
      "seller": seller ? {
        "@type": "Person",
        "name": seller.name
      } : undefined
    }
  };
};

// Breadcrumb
export const generateBreadcrumbSchema = (
  baseUrl: string, 
  items: { name: string, url: string }[]
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
};

// FAQ
export const generateFaqSchema = (questions: { question: string, answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
};

// LocalBusiness
export const generateLocalBusinessSchema = (
  name: string,
  description: string,
  address: {
    street?: string,
    locality: string,
    region: string,
    postalCode?: string,
    country: string
  },
  baseUrl: string,
  telephone?: string,
  email?: string
) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": baseUrl,
    "telephone": telephone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.locality,
      "addressRegion": address.region,
      "postalCode": address.postalCode,
      "addressCountry": address.country
    }
  };
};

// Clean schema by removing undefined values
export const cleanSchema = (schema: any) => {
  return JSON.parse(JSON.stringify(schema));
};
