
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { categories } from '@/types/categories';

const generateSitemap = async () => {
  const baseUrl = window.location.origin;
  
  // Fetch active listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, updated_at')
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });
  
  if (listingsError) {
    console.error('Error fetching listings for sitemap:', listingsError);
    return null;
  }
  
  // Use categories from the imported categories array instead of fetching from DB
  // since we don't have a categories table in Supabase
  
  // Create XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add homepage
  xml += `  <url>\n    <loc>${baseUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Add categories page
  xml += `  <url>\n    <loc>${baseUrl}/categories</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  
  // Add product listings
  if (listings) {
    listings.forEach(listing => {
      xml += `  <url>\n    <loc>${baseUrl}/product/${listing.id}</loc>\n    <lastmod>${new Date(listing.updated_at).toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });
  }
  
  // Add categories from the imported categories array
  categories.forEach(category => {
    xml += `  <url>\n    <loc>${baseUrl}/category/${category.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    
    // Add subcategories for each category
    category.subcategories.forEach(subcategory => {
      xml += `  <url>\n    <loc>${baseUrl}/category/${category.id}/${subcategory.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    });
  });
  
  xml += '</urlset>';
  
  return xml;
};

const SitemapGenerator = () => {
  useEffect(() => {
    // This component doesn't render anything but can be used
    // to generate a sitemap when needed (e.g., in an admin panel)
    console.log('Sitemap generator component mounted');
  }, []);
  
  return null;
};

export { generateSitemap, SitemapGenerator };
