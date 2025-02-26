
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
import MakeOfferDialog from "@/components/product/MakeOfferDialog";
import ProductLoader from "@/components/product/ProductLoader";
import ProductNotFound from "@/components/product/ProductNotFound";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useProductActions } from "@/hooks/useProductActions";
import { useToast } from "@/components/ui/use-toast";

interface Seller {
  id: string;
  full_name: string;
  created_at: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  const { data: product, isLoading, isError } = useProductDetails(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id, product?.category);
  const {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  } = useProductActions(id, product?.user_id);

  // Fetch seller data
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
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      navigate(`/chat/${currentConversationId}`);
    }
  }, [currentConversationId, navigate]);

  if (isLoading) {
    return <ProductLoader />;
  }

  if (isError || !product) {
    return <ProductNotFound />;
  }

  // Extract just the area name from the location string
  const displayLocation = product.location?.split(',')[0] || 'Location not specified';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <ImageGallery
              images={product.images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
            />
          </div>

          <div className="space-y-6">
            <ProductInfo
              title={product.title}
              price={product.price}
              location={displayLocation}
              createdAt={product.created_at}
              condition={product.condition}
              description={product.description}
            />

            {seller && (
              <SellerInfo
                seller={seller}
                onChatClick={() => handleChatWithSeller(session)}
                onMakeOffer={() => handleMakeOffer(session)}
              />
            )}
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </main>

      <MakeOfferDialog
        isOpen={isOfferDialogOpen}
        onClose={() => setIsOfferDialogOpen(false)}
        productTitle={product.title}
        productPrice={product.price}
        conversationId={currentConversationId}
        onOfferSuccess={() => {
          navigate(`/chat/${currentConversationId}`);
        }}
      />
    </div>
  );
};

export default ProductPage;
