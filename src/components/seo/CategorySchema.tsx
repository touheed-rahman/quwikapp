
import { Helmet } from "react-helmet";

interface CategorySchemaProps {
  categoryName: string;
  subcategories?: string[];
  description?: string;
  url?: string;
}

const CategorySchema = ({
  categoryName,
  subcategories = [],
  description,
  url
}: CategorySchemaProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const categoryUrl = url || `${baseUrl}/category/${categoryName.toLowerCase()}`;

  const categoryDescription = description || 
    `Browse ${categoryName} listings on Quwik. Find the best local deals in ${categoryName} category.`;

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Categories",
      "item": `${baseUrl}/categories`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": categoryName,
      "item": categoryUrl
    }
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  // Collection Page schema
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} - Quwik Marketplace`,
    "description": categoryDescription,
    "url": categoryUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": subcategories.map((subcat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/category/${categoryName.toLowerCase()}/${subcat.toLowerCase()}`,
        "name": subcat
      }))
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(collectionPageSchema)}
      </script>
    </Helmet>
  );
};

export default CategorySchema;
