
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FeatureDialog from "@/components/product/FeatureDialog";
import ProductLoader from "@/components/product/ProductLoader";
import ProductNotFound from "@/components/product/ProductNotFound";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useProductActions } from "@/hooks/useProductActions";
import { useToast } from "@/components/ui/use-toast";
import ProductLayout from "@/components/product/ProductLayout";
import ProductSeo from "@/components/product/ProductSeo";
import ProductContent from "@/components/product/ProductContent";

interface Seller {
  id: string;
  full_name: string;
  created_at: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { data: product, isLoading, isError } = useProductDetails(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id, product?.category, product?.subcategory);
  const {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  } = useProductActions(id, product?.user_id);

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

  return (
    <ProductLayout>
      <ProductSeo product={product} seller={seller} />
      
      <ProductContent 
        product={product}
        seller={seller}
        relatedProducts={relatedProducts}
        isCurrentUserSeller={isCurrentUserSeller}
        currentUserId={currentUserId}
        onChatClick={() => handleChatWithSeller(session)}
        onMakeOffer={() => setIsFeatureDialogOpen(true)}
      />
      
      <FeatureDialog
        isOpen={isFeatureDialogOpen}
        onClose={() => setIsFeatureDialogOpen(false)}
      />
    </ProductLayout>
  );
};

export default ProductPage;
