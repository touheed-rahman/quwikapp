
import { useState, useEffect } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProductCondition } from "@/types/categories";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface ProductCardProps {
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

const ProductCard = ({
  id,
  title,
  price,
  location,
  image,
  featured,
  condition,
  category
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('wishlists')
        .select()
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .maybeSingle();

      setIsWishlisted(!!data);
    };

    checkWishlistStatus();
  }, [id]);

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

  const getConditionColor = (condition?: ProductCondition) => {
    switch (condition) {
      case "new":
        return "bg-green-500 text-white ring-green-200";
      case "excellent":
        return "bg-primary text-white ring-primary/20";
      case "good":
        return "bg-yellow-500 text-white ring-yellow-200";
      case "moderate":
        return "bg-orange-500 text-white ring-orange-200";
      default:
        return "bg-gray-500 text-white ring-gray-200";
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatLocation = (location: string) => {
    // Extract just the first part of the location (usually the city/area name)
    const firstPart = location?.split('|')[0]?.split(',')[0]?.trim();
    // Return a shortened version or placeholder if not available
    return firstPart || 'Location not specified';
  };

  return (
    <Link to={`/product/${id}`} className="block transform hover:-translate-y-1 transition-all duration-300">
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
          <h3 className="text-sm font-medium line-clamp-1 text-foreground/90 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground overflow-hidden max-w-[120px]">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate" title={location}>{formatLocation(location)}</span>
            </div>
            <div className="flex gap-1">
              {condition && (
                <Badge 
                  className={`text-[10px] px-2 py-0.5 rounded-full ring-2 ${getConditionColor(condition)}`}
                >
                  {capitalizeFirstLetter(condition)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
