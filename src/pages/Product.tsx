
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
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
import { Card } from "@/components/ui/card";

interface Seller {
  full_name: string;
  created_at: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [session, setSession] = useState<any>(null);

  const { data: product, isLoading, isError } = useProductDetails(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id, product?.category);
  const {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  } = useProductActions(id, product?.user_id);

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

  const displayLocation = product.location?.split(',')[0] || 'Location not specified';
  const seller = product.profiles as Seller;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <Card className="p-6 lg:p-8 rounded-xl shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="lg:sticky lg:top-24">
              <ImageGallery
                images={product.images}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            </div>

            <div className="space-y-8">
              <ProductInfo
                title={product.title}
                price={product.price}
                location={displayLocation}
                createdAt={product.created_at}
                condition={product.condition}
                description={product.description}
                category={product.category}
                km_driven={product.km_driven}
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
        </Card>

        <div className="mt-12">
          <RelatedProducts products={relatedProducts} />
        </div>
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
