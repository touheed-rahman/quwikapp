
import { Helmet } from "react-helmet";

interface SocialMetaTagsProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  language: string;
  openGraphType: string;
  twitterCard: string;
}

const SocialMetaTags = ({
  title,
  description,
  image,
  url,
  type,
  language,
  openGraphType,
  twitterCard
}: SocialMetaTagsProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  return (
    <Helmet>
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={openGraphType} />
      <meta property="og:site_name" content="Quwik" />
      <meta property="og:locale" content={language} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@quwik" />
      <meta name="twitter:creator" content="@quwik" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default SocialMetaTags;
