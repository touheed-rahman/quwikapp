
import { Listing } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";

interface HomeSchemaProps {
  randomFeaturedListings: Listing[];
  locationDetails: {
    locality: string;
    region: string;
    country: string;
  } | null;
  faqData: Array<{
    question: string;
    answer: string;
  }>;
}

const HomeSchema = ({ randomFeaturedListings, locationDetails, faqData }: HomeSchemaProps) => {
  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Quwik - Buy & Sell Locally",
    "description": "Discover the best local deals on Quwik. Buy and sell items locally - mobiles, electronics, cars, bikes, furniture and more.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".featured-text"]
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": randomFeaturedListings.map((listing, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${window.location.origin}/product/${listing.id}`,
        "name": listing.title,
        "image": getFirstImageUrl(listing.images)
      }))
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(homepageStructuredData)}
      </script>
    </>
  );
};

export default HomeSchema;
