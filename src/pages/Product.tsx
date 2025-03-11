
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ChatWindow from "@/components/chat/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SellerInfo from "@/components/product/SellerInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import FeatureDialog from "@/components/product/FeatureDialog";
import ProductLoader from "@/components/product/ProductLoader";
import ProductNotFound from "@/components/product/ProductNotFound";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useProductActions } from "@/hooks/useProductActions";
import { useToast } from "@/components/ui/use-toast";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { motion } from "framer-motion";

interface Seller {
  id: string;
  full_name: string;
  created_at: string;
}

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [session, setSession] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { data: product, isLoading, isError } = useProductDetails(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(slug, product?.category, product?.subcategory);
  const {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  } = useProductActions(slug, product?.user_id);

  // Update URL to use slug if needed
  useEffect(() => {
    if (product && product.slug && slug !== product.slug) {
      navigate(`/product/${product.slug}`, { replace: true });
    }
  }, [product, slug, navigate]);

  const { data: seller } = useQuery({
    queryKey: ['seller', product?.user_id],
    queryFn: async () => {
      if (!product?.user_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', product.user_id)
        .single();
      
      if (error) throw error;
      return data as Seller;
    },
    enabled: !!product?.user_id
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCurrentUserId(session?.user?.id || null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCurrentUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      navigate(`/chat/${currentConversationId}`);
    }
  }, [currentConversationId, navigate]);

  const isCurrentUserSeller = !!currentUserId && currentUserId === product?.user_id;

  if (isLoading) {
    return <ProductLoader />;
  }

  if (isError || !product) {
    return <ProductNotFound />;
  }

  document.title = `${product.title} | ${product.adNumber} | Quwik`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 pt-20 pb-20 overflow-x-hidden max-w-full">
        <motion.div 
          className="grid lg:grid-cols-2 gap-4 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
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
                onChatClick={() => handleChatWithSeller(session)}
                onMakeOffer={() => setIsFeatureDialogOpen(true)}
              />
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <RelatedProducts products={relatedProducts} />
        </motion.div>
      </main>

      <FeatureDialog
        isOpen={isFeatureDialogOpen}
        onClose={() => setIsFeatureDialogOpen(false)}
      />
      
      <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default ProductPage;
