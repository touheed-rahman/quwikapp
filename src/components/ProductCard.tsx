
import { useState, useEffect } from "react";
import { Heart, MapPin } from "lucide-react";
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
  km_driven?: number | null;
}

const ProductCard = ({
  id,
  title,
  price,
  location,
  image,
  featured,
  condition,
  category,
  km_driven
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
        return "bg-green-500 text-white";
      case "excellent":
        return "bg-primary text-white";
      case "good":
        return "bg-yellow-500 text-white";
      case "moderate":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatLocation = (location: string) => {
    const firstPart = location?.split('|')[0]?.split(',')[0]?.trim();
    return firstPart || 'Location not specified';
  };

  return (
    <Link to={`/product/${id}`} className="block">
      <Card className="overflow-hidden border border-neutral-200 hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/90 h-8 w-8 shadow-sm hover:text-foreground ${
              isWishlisted ? "text-red-500" : ""
            } ${isLoading ? "opacity-50" : ""}`}
            onClick={handleWishlist}
            disabled={isLoading}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
        </div>
        <div className="p-3 space-y-1">
          <p className="text-lg font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium line-clamp-1 text-foreground/90">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground overflow-hidden max-w-[120px]">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate" title={location}>{formatLocation(location)}</span>
            </div>
            {condition && (
              <Badge 
                className={`text-[10px] px-1.5 py-0.5 rounded-sm ${getConditionColor(condition)}`}
              >
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
