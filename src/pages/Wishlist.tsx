
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Heart } from "lucide-react";
import { ProductCondition } from "@/types/categories";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { motion } from "framer-motion";
import { useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";

const Wishlist = () => {
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['wishlist-listings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: wishlistItems, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', user.id);

      if (wishlistError) throw wishlistError;

      return wishlistItems
        .map(item => item.listings)
        .filter(Boolean)
        .map(listing => ({
          ...listing,
          condition: listing.condition as ProductCondition
        }));
    }
  });

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <Heart className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-2xl font-bold">My Wishlist</h1>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading wishlist items...</p>
          </div>
        ) : listings.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12 px-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-primary/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="h-16 w-16 text-primary/20 mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">Your wishlist is empty</h3>
            <p className="text-center text-muted-foreground max-w-md mb-4">
              Save items you're interested in by tapping the heart icon on any listing
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location || "Location not specified"}
                  image={getFirstImageUrl(listing.images)}
                  condition={listing.condition}
                  featured={listing.featured}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      
      <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Wishlist;
