
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ProductCondition } from "@/types/categories";
import ChatWindow from "@/components/chat/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SellerInfo from "@/components/product/SellerInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useToast } from "@/components/ui/use-toast";
import MakeOfferDialog from "@/components/product/MakeOfferDialog";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

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

  // Fetch the product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Product not found');

      return {
        ...data,
        condition: data.condition as ProductCondition,
        seller: {
          name: data.profiles.full_name || 'Anonymous',
          memberSince: new Date(data.profiles.created_at).getFullYear().toString(),
          listings: 0,
        }
      };
    }
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    enabled: !!product,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('category', product?.category)
        .eq('status', 'approved')
        .neq('id', id)
        .limit(4);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        location: item.location,
        image: item.images[0] ? 
          supabase.storage.from('listings').getPublicUrl(item.images[0]).data.publicUrl 
          : "https://via.placeholder.com/300",
        condition: item.condition as ProductCondition,
      }));
    }
  });

  const handleChatWithSeller = async () => {
    if (!product || !id) return;
    
    // Check if user is logged in
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the seller",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    // Check if user is trying to chat with themselves
    if (session.user.id === product.user_id) {
      toast({
        title: "Cannot chat with yourself",
        description: "This is your own listing",
        variant: "destructive"
      });
      return;
    }

    try {
      // First check if a conversation already exists
      const { data: existingConversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', id)
        .eq('buyer_id', session.user.id)
        .single();

      if (conversationError && conversationError.code !== 'PGRST116') {
        throw conversationError;
      }

      if (existingConversation) {
        // If conversation exists, set it as current and open offer dialog
        setCurrentConversationId(existingConversation.id);
        return;
      }

      // If no conversation exists, create one
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          listing_id: id,
          buyer_id: session.user.id,
          seller_id: product.user_id,
        })
        .select()
        .single();

      if (createError) throw createError;

      setCurrentConversationId(newConversation.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
      console.error('Chat error:', error);
    }
  };

  const handleMakeOffer = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make an offer",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    if (!currentConversationId) {
      await handleChatWithSeller();
    }
    
    setIsOfferDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <Button 
              className="mt-4"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
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
              onChatClick={handleChatWithSeller}
              onMakeOffer={handleMakeOffer}
            />
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </main>

      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        initialSeller={{
          name: product.seller.name,
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
          navigate(`/chat/${currentConversationId}`);
        }}
      />
    </div>
  );
};

export default ProductPage;
