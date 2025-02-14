
import { useState, useEffect } from "react";
import { Heart, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
          title: "Authentication required",
          description: "Please login to add items to your wishlist",
          variant: "destructive"
        });
        return;
      }

      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);

        if (error) throw error;
        setIsWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist"
        });
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert([{
            user_id: user.id,
            listing_id: id
          }]);

        if (error) throw error;
        setIsWishlisted(true);
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist"
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
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

  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden border-0 bg-transparent">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 h-8 w-8 ${
              isWishlisted ? "text-red-500" : ""
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleWishlist}
            disabled={isLoading}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
          {featured && (
            <Badge variant="default" className="absolute top-2 left-2 bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-2">
          <p className="text-lg font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium line-clamp-2 mb-1 text-foreground/80">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            {condition && (
              <Badge className={getConditionColor(condition as ProductCondition)}>
                {condition}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
