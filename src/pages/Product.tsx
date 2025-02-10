
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const ProductPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  const { data: product, isLoading } = useProductDetails(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id, product?.category);
  const {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  } = useProductActions(id, product?.user_id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      setIsChatOpen(true);
    }
  }, [currentConversationId]);

  if (isLoading) {
    return <ProductLoader />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          <ImageGallery
            images={product.images}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
          />

          <div className="space-y-6">
            <ProductInfo
              title={product.title}
              price={product.price}
              location={product.location}
              createdAt={product.created_at}
              condition={product.condition}
              description={product.description}
            />

            <SellerInfo
              seller={product.seller}
              onChatClick={() => handleChatWithSeller(session)}
              onMakeOffer={() => handleMakeOffer(session)}
            />
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </main>

      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        initialSeller={{
          name: product.seller.full_name || 'Anonymous',
          isVerified: true,
          productInfo: {
            title: product.title,
            price: product.price.toString()
          }
        }}
      />

      <MakeOfferDialog
        isOpen={isOfferDialogOpen}
        onClose={() => setIsOfferDialogOpen(false)}
        productTitle={product.title}
        productPrice={product.price}
        conversationId={currentConversationId}
        onOfferSuccess={() => {
          window.location.href = `/chat/${currentConversationId}`;
        }}
      />
    </div>
  );
};

export default ProductPage;
