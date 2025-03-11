
import { Helmet } from "react-helmet";

interface GeoMobileTagsProps {
  geoRegion: string;
  geoPlaceName: string;
  alternateLanguages: {
    lang: string;
    url: string;
  }[];
}

const GeoMobileTags = ({
  geoRegion,
  geoPlaceName,
  alternateLanguages
}: GeoMobileTagsProps) => {
  return (
    <Helmet>
      {/* Geo Meta Tags */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlaceName} />
      <meta name="geo.position" content="28.6139;77.2090" />
      <meta name="ICBM" content="28.6139, 77.2090" />

      {/* Mobile App Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Quwik" />
      <meta name="application-name" content="Quwik" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Alternate Languages */}
      {alternateLanguages.map((alt) => (
        <link rel="alternate" hrefLang={alt.lang} href={alt.url} key={alt.lang} />
      ))}
    </Helmet>
  );
};

export default GeoMobileTags;
