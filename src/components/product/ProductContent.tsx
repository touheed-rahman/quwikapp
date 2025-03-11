
import { motion } from "framer-motion";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SellerInfo from "@/components/product/SellerInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useState } from "react";

interface ProductContentProps {
  product: any;
  seller: any | null;
  relatedProducts: any[];
  isCurrentUserSeller: boolean;
  currentUserId: string | null;
  onChatClick: () => void;
  onMakeOffer: () => void;
}

const ProductContent = ({ 
  product, 
  seller, 
  relatedProducts, 
  isCurrentUserSeller,
  currentUserId,
  onChatClick,
  onMakeOffer
}: ProductContentProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGallery
            images={product.images}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        </motion.div>

        <motion.div 
          className="space-y-4 lg:space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductInfo
            title={product.title}
            price={product.price}
            location={product.location}
            createdAt={product.created_at}
            condition={product.condition}
            description={product.description}
            category={product.category}
            adNumber={product.adNumber}
            id={product.id}
            viewCount={product.view_count}
            brand={product.brand}
            specs={product.specs}
          />

          {seller && (
            <SellerInfo
              seller={seller}
              currentUserId={currentUserId}
              isCurrentUserSeller={isCurrentUserSeller}
              onChatClick={onChatClick}
              onMakeOffer={onMakeOffer}
            />
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <RelatedProducts products={relatedProducts} />
      </motion.div>
    </>
  );
};

export default ProductContent;
