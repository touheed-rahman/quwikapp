
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define the structure for our sitemap entries
interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SitemapRoute = () => {
  const [sitemap, setSitemap] = useState<string | null>(null);

  useEffect(() => {
    const generateSitemap = async () => {
      const baseUrl = window.location.origin;
      const urls: SitemapUrl[] = [];
      
      // Add static pages
      urls.push({ 
        loc: baseUrl, 
        changefreq: 'daily', 
        priority: 1.0 
      });
      
      urls.push({ 
        loc: `${baseUrl}/categories`, 
        changefreq: 'weekly', 
        priority: 0.8 
      });
      
      urls.push({ 
        loc: `${baseUrl}/fresh-recommendations`, 
        changefreq: 'daily', 
        priority: 0.7 
      });
      
      // Fetch active listings
      const { data: listings } = await supabase
        .from('listings')
        .select('id, updated_at')
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(1000) // Limit to 1000 most recent listings
        .order('updated_at', { ascending: false });
      
      // Add product pages
      if (listings) {
        listings.forEach(listing => {
          urls.push({
            loc: `${baseUrl}/product/${listing.id}`,
            lastmod: new Date(listing.updated_at).toISOString(),
            changefreq: 'weekly',
            priority: 0.7
          });
        });
      }
      
      // Generate XML
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${url.loc}</loc>\n`;
        if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        if (url.priority !== undefined) xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
        xml += '  </url>\n';
      });
      
      xml += '</urlset>';
      setSitemap(xml);
    };
    
    generateSitemap();
  }, []);
  
  // If sitemap is generated, display it as XML
  if (sitemap) {
    // Create a blob with the XML content
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Download or display the XML
    window.location.href = url;
    
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    
    return null;
  }
  
  // While generating, show nothing or redirect
  return <Navigate to="/" />;
};

export default SitemapRoute;
