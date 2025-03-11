
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
  sku?: string;
  weight?: string;
  width?: string;
  height?: string;
  depth?: string;
  reviewCount?: number;
  ratingValue?: number;
}

interface ProductSchemaType {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string[];
  sku: string;
  mpn: string;
  brand?: {
    "@type": string;
    name: string;
  };
  offers: {
    "@type": string;
    url: string;
    priceCurrency: string;
    price: number;
    priceValidUntil: string;
    itemCondition: string;
    availability: string;
    seller?: {
      "@type": string;
      name: string;
    };
  };
  aggregateRating: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
  review: {
    "@type": string;
    reviewRating: {
      "@type": string;
      ratingValue: string;
      bestRating: string;
    };
    author: {
      "@type": string;
      name: string;
    };
  };
  category?: string;
  size?: {
    "@type": string;
    weight?: string;
    width?: string;
    height?: string;
    depth?: string;
  };
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
  availability = "InStock",
  sku,
  weight,
  width,
  height,
  depth,
  reviewCount = 1,
  ratingValue = 4.5
}: ProductSchemaProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${baseUrl}/product/${id}`;

  // Transform image array to full URLs
  const imageUrls = images.map(img => 
    img.startsWith('http') ? img : `${baseUrl}${img}`
  );

  // Map condition to standard schema values
  let itemCondition = "https://schema.org/UsedCondition";
  if (condition === "new") {
    itemCondition = "https://schema.org/NewCondition";
  } else if (condition === "excellent") {
    itemCondition = "https://schema.org/UsedCondition";
  } else if (condition === "good") {
    itemCondition = "https://schema.org/UsedCondition";
  } else if (condition === "moderate") {
    itemCondition = "https://schema.org/UsedCondition";
  }

  // Create a product SKU if not provided
  const productSku = sku || `QUWIK-${id.substring(0, 8)}`;

  const productSchema: ProductSchemaType = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": description,
    "image": imageUrls,
    "sku": productSku,
    "mpn": productSku,
    "brand": brand ? {
      "@type": "Brand",
      "name": brand
    } : undefined,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": itemCondition,
      "availability": `https://schema.org/${availability}`,
      "seller": seller ? {
        "@type": "Person",
        "name": seller.name
      } : undefined
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toString(),
      "reviewCount": reviewCount.toString()
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": ratingValue.toString(),
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Quwik Customer"
      }
    },
    "category": category
  };

  // Add dimensions and weight if provided
  if (weight || width || height || depth) {
    productSchema.size = {
      "@type": "QuantitativeValue"
    };
    
    if (weight) productSchema.size.weight = weight;
    if (width) productSchema.size.width = width;
    if (height) productSchema.size.height = height;
    if (depth) productSchema.size.depth = depth;
  }

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
