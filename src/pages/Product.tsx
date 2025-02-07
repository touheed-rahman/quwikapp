import { useState } from "react";
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

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const handleChatWithSeller = () => {
    if (!product) return;
    
    // Check if user is logged in
    if (!session) {
      // Save the product info to localStorage before redirecting
      localStorage.setItem('intended_conversation', id || '');
      navigate('/profile');
      return;
    }

    // If logged in, navigate to chat
    navigate(`/chat/${id}`);
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

  const [session, setSession] = useState<any>(null);
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
    </div>
  );
};

export default ProductPage;
