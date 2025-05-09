import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SellerInfo from "@/components/product/SellerInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useProductActions } from "@/hooks/useProductActions";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OfferForm from "@/components/product/OfferForm";
import ChatWindow from "@/components/chat/ChatWindow";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const { data: product, isLoading, error } = useProductDetails(id);
  
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
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="text-primary hover:underline"
            >
              Return to homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentUserSeller = session?.user?.id === product.user_id;

  const handleChatClick = () => {
    if (session) {
      handleChatWithSeller(session);
      setIsChatOpen(true);
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the seller",
        variant: "destructive"
      });
      navigate('/profile');
    }
  };

  const handleOfferClick = () => {
    if (session) {
      handleMakeOffer(session);
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to make an offer",
        variant: "destructive"
      });
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProductGallery images={product.images} />
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
              images={product.images}
              userId={product.user_id}
            />
          </div>
          
          <div className="space-y-6">
            <SellerInfo 
              seller={product.profiles} 
              currentUserId={session?.user?.id}
              isCurrentUserSeller={isCurrentUserSeller}
              onChatClick={handleChatClick}
              onMakeOffer={handleOfferClick}
            />
            <RelatedProducts 
              category={product.category}
              subcategory={product.subcategory}
              currentProductId={product.id}
            />
          </div>
        </div>
      </div>
      
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <OfferForm 
            productId={product.id}
            productTitle={product.title}
            productPrice={product.price}
            sellerId={product.user_id}
            conversationId={currentConversationId}
            onClose={() => setIsOfferDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {isChatOpen && (
        <ChatWindow 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          initialConversationId={currentConversationId}
        />
      )}
    </div>
  );
};

export default Product;
