
import { Helmet } from "react-helmet";

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    street?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  geo?: {
    latitude?: number;
    longitude?: number;
  };
  image?: string;
  url?: string;
  sameAs?: string[];
  openingHours?: string[];
}

const LocalBusinessSchema = ({
  name = "Quwik Marketplace",
  description = "Quwik is a local marketplace for buying and selling goods and services.",
  telephone = "+91 1234567890",
  email = "support@quwik.com",
  address = {
    street: "123 Main Street",
    locality: "Mumbai",
    region: "Maharashtra",
    postalCode: "400001",
    country: "IN"
  },
  geo = {
    latitude: 19.0760,
    longitude: 72.8777
  },
  image = "/logo.png",
  url,
  sameAs = [
    "https://www.facebook.com/quwik",
    "https://twitter.com/quwik",
    "https://www.instagram.com/quwik"
  ],
  openingHours = ["Mo-Su 00:00-23:59"]
}: LocalBusinessSchemaProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const businessUrl = url || baseUrl;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": businessUrl,
    "logo": imageUrl,
    "image": imageUrl,
    "telephone": telephone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.locality,
      "addressRegion": address.region,
      "postalCode": address.postalCode,
      "addressCountry": address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    },
    "sameAs": sameAs,
    "openingHoursSpecification": openingHours.map(hours => {
      const [days, timeRange] = hours.split(" ");
      const [opens, closes] = timeRange.split("-");
      
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": days,
        "opens": opens,
        "closes": closes
      };
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
