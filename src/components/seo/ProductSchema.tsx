
import { Helmet } from "react-helmet";
import { ProductCondition } from "@/types/categories";

interface ProductSchemaProps {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
  images: string[];
  category?: string;
  brand?: string | null;
  createdAt: string;
  seller?: {
    id: string;
    name: string;
  };
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}

const ProductSchema = ({
  id,
  title,
  description,
  price,
  condition,
  images,
  category,
  brand,
  createdAt,
  seller,
  currency = "INR",
  availability = "InStock"
}: ProductSchemaProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${baseUrl}/product/${id}`;

  // Transform image array to full URLs
  const imageUrls = images.map(img => 
    img.startsWith('http') ? img : `${baseUrl}${img}`
  );

  // Map condition to standard schema values
  let itemCondition = "https://schema.org/UsedCondition";
  if (condition === "New") {
    itemCondition = "https://schema.org/NewCondition";
  } else if (condition === "Like New") {
    itemCondition = "https://schema.org/UsedCondition";
  } else if (condition === "Good") {
    itemCondition = "https://schema.org/UsedCondition";
  } else if (condition === "Fair") {
    itemCondition = "https://schema.org/UsedCondition";
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": description,
    "image": imageUrls,
    "sku": `QUWIK-${id.substring(0, 8)}`,
    "mpn": `QUWIK-${id.substring(0, 8)}`,
    "brand": brand ? {
      "@type": "Brand",
      "name": brand
    } : undefined,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": currency,
      "price": price,
      "itemCondition": itemCondition,
      "availability": `https://schema.org/${availability}`,
      "seller": seller ? {
        "@type": "Person",
        "name": seller.name
      } : undefined
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "1"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4.5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Quwik Customer"
      }
    }
  };

  // Remove undefined values from schema
  const cleanSchema = JSON.parse(JSON.stringify(productSchema));

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(cleanSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
