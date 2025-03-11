
import { useState } from "react";
import { ShoppingCart, Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCondition } from "@/types/categories";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ShopProductCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  date?: string;
  featured?: boolean;
  condition?: ProductCondition;
  category?: string;
}

const ShopProductCard = ({
  id,
  title,
  price,
  location,
  image,
  featured,
  condition,
}: ShopProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please login",
          description: "Login to add items to wishlist",
          variant: "destructive"
        });
        return;
      }

      if (isWishlisted) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        setIsWishlisted(false);
      } else {
        await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, listing_id: id }]);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please login",
          description: "Login to add items to cart",
          variant: "destructive"
        });
        return;
      }

      // Check if item already in cart
      const { data: cartItems } = await supabase
        .from('cart_items')
        .select()
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();

      if (cartItems) {
        toast({
          title: "Already in cart",
          description: "This item is already in your cart",
        });
      } else {
        // Add to cart
        await supabase
          .from('cart_items')
          .insert([{ 
            user_id: user.id, 
            listing_id: id,
            quantity: 1
          }]);
          
        toast({
          title: "Added to cart",
          description: "Item added to your cart",
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // First add to cart, then redirect to checkout
    handleAddToCart(e).then(() => {
      window.location.href = '/checkout';
    });
  };

  const formatLocation = (location: string) => {
    const firstPart = location?.split('|')[0]?.split(',')[0]?.trim();
    return firstPart || 'Location not specified';
  };

  return (
    <Link to={`/product/${id}?mode=shop`}>
      <Card className="group overflow-hidden border-[1.5px] border-neutral-200 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white h-8 w-8 shadow-lg ring-1 ring-black/5 ${
              isWishlisted ? "text-red-500" : ""
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleWishlist}
            disabled={isLoading}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
          {featured && (
            <Badge variant="default" className="absolute top-2 left-2 bg-yellow-500 text-white font-medium ring-2 ring-yellow-200">
              <Star className="h-3 w-3 mr-1" /> Featured
            </Badge>
          )}
        </div>
        <div className="p-3 space-y-2">
          <p className="text-lg font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-[10px] text-muted-foreground overflow-hidden max-w-full mb-2">
            <MapPin className="h-3 w-3 flex-shrink-0 mr-1" />
            <span className="truncate" title={location}>{formatLocation(location)}</span>
          </div>
          
          {/* Shop-specific buttons */}
          <div className="flex gap-2 pt-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-white hover:bg-primary hover:text-white"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Add to Cart
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={handleBuyNow}
              disabled={isAddingToCart}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ShopProductCard;
