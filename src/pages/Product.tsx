
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Seller {
  full_name: string;
  created_at: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

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
      navigate(`/chat/${currentConversationId}`);
    }
  }, [currentConversationId, navigate]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title,
          text: `Check out this listing: ${product?.title}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link has been copied to clipboard"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Failed to share the product",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <ProductLoader />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const seller = product.seller as Seller;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
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
              location={product.location}
              createdAt={product.created_at}
              condition={product.condition}
              description={product.description}
            />

            <SellerInfo
              seller={{
                name: seller?.full_name || 'Anonymous',
                memberSince: seller?.created_at ? new Date(seller.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
                listings: 0
              }}
              onChatClick={() => handleChatWithSeller(session)}
              onMakeOffer={() => handleMakeOffer(session)}
            />
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
