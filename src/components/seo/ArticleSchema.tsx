
import { Helmet } from "react-helmet";

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName?: string;
  authorImage?: string;
  categoryName?: string;
  tags?: string[];
}

const ArticleSchema = ({
  title,
  description,
  image,
  publishedAt,
  modifiedAt,
  authorName = "Quwik",
  authorImage = "/logo.png",
  categoryName,
  tags = []
}: ArticleSchemaProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const authorImageUrl = authorImage.startsWith('http') ? authorImage : `${baseUrl}${authorImage}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": authorName,
      "image": authorImageUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Quwik",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": publishedAt,
    "dateModified": modifiedAt || publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "keywords": tags.join(", "),
    "articleSection": categoryName || "Marketplace"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};

export default ArticleSchema;
