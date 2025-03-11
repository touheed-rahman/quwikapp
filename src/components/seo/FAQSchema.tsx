
import { Helmet } from "react-helmet";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  category?: string;
  mainEntity?: {
    name: string;
    description: string;
    url: string;
  }
}

const FAQSchema = ({ 
  faqs,
  category,
  mainEntity
}: FAQSchemaProps) => {
  // Enhance FAQ schema with category-specific information if available
  let schemaType = "FAQPage";
  let additionalProperties = {};
  
  if (category) {
    additionalProperties = {
      ...additionalProperties,
      about: {
        "@type": "Thing",
        name: category,
        description: `Frequently asked questions about ${category} on Quwik marketplace`
      }
    };
  }
  
  if (mainEntity) {
    additionalProperties = {
      ...additionalProperties,
      mainEntity: {
        "@type": "WebPage",
        "@id": mainEntity.url,
        name: mainEntity.name,
        description: mainEntity.description
      }
    };
  }
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    ...additionalProperties,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default FAQSchema;
