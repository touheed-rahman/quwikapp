
import SeoHead from "@/components/seo/SeoHead";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { getProductKeywords, getSeoTitle, getSeoDescription } from "@/utils/KeywordsService";
import { categories } from "@/types/categories";
import { supabase } from "@/integrations/supabase/client";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ProductSeoProps {
  product: any;
  seller?: {
    id: string;
    full_name: string;
  } | null;
}

const ProductSeo = ({ product, seller }: ProductSeoProps) => {
  if (!product) return null;
  
  const getFullImageUrls = () => {
    if (!product.images || product.images.length === 0) {
      return ["/placeholder.svg"];
    }
    
    return product.images.map(img => 
      supabase.storage.from('listings').getPublicUrl(img).data.publicUrl
    );
  };

  const getCategoryName = () => {
    if (!product.category) return null;
    
    const category = categories.find(c => c.id === product.category);
    return category ? category.name : product.category;
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs = [
      { name: "Home", url: "/" }
    ];

    if (product.category) {
      breadcrumbs.push({
        name: product.category,
        url: `/category/${product.category}`
      });

      if (product.subcategory) {
        breadcrumbs.push({
          name: product.subcategory,
          url: `/category/${product.category}/${product.subcategory}`
        });
      }
    }

    breadcrumbs.push({
      name: product.title,
      url: `/product/${product.id}`
    });

    return breadcrumbs;
  };

  const productKeywords = getProductKeywords(
    product.title,
    product.category,
    product.brand,
    product.condition
  );
  
  const seoTitle = getSeoTitle(
    product.title,
    product.category,
    product.condition,
    product.location?.split('|')[0]
  );
  
  const seoDescription = getSeoDescription(
    product.description || '',
    product.title,
    product.category,
    product.price,
    product.condition
  );

  const longTailKeywords = [
    `best ${product.condition} ${product.category || 'items'} near me`,
    `affordable ${product.brand || ''} ${product.category || 'products'} for sale`,
    `${product.condition} ${product.category || 'items'} in ${product.location?.split('|')[0] || 'my area'}`,
    `buy ${product.brand || 'quality'} products online marketplace`,
    `second hand ${product.category || 'items'} with warranty`
  ];

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={productKeywords}
        longTailKeywords={longTailKeywords}
        image={getFullImageUrls()[0]}
        type="product"
        publishedAt={product.created_at}
        modifiedAt={product.updated_at}
        canonical={`${window.location.origin}/product/${product.id}`}
        openGraphType="product"
      />
      
      <ProductSchema
        id={product.id}
        title={product.title}
        description={product.description || ''}
        price={product.price}
        condition={product.condition}
        images={getFullImageUrls()}
        category={getCategoryName()}
        brand={product.brand}
        createdAt={product.created_at}
        seller={seller ? {
          id: seller.id,
          name: seller.full_name || 'Quwik Seller'
        } : undefined}
        keywords={productKeywords}
        color={product.specs?.color}
        material={product.specs?.material}
      />
      
      <BreadcrumbSchema items={generateBreadcrumbs()} />
    </>
  );
};

export default ProductSeo;
