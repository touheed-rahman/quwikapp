
import { Heart, Share2, MapPin, Calendar, Copy, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import ProductSpecsCard from "./ProductSpecsCard";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProductInfoProps {
  title: string;
  price: number;
  location: string;
  createdAt: string;
  condition: ProductCondition;
  description: string;
  category?: string;
  adNumber?: string;
  id?: string;
  viewCount?: number;
  brand?: string | null;
  specs?: Record<string, any> | null;
  images?: string[];
  userId?: string;
}

const ProductInfo = ({
  title,
  price,
  location,
  createdAt,
  condition,
  description,
  category,
  adNumber,
  id,
  viewCount = 0,
  brand,
  specs,
  images = [],
  userId
}: ProductInfoProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [copying, setCopying] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Extract just the area name
  const displayLocation = location?.split(/[|,]/)[0].trim() || 'Location not specified';

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this listing: ${title}`,
          url: url
        });
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    setCopying(true);
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        });
        setTimeout(() => setCopying(false), 2000);
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive"
        });
        setCopying(false);
      });
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to cart",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }
      
      if (user.id === userId) {
        toast({
          title: "Cannot purchase your own item",
          description: "You cannot purchase your own listing",
          variant: "destructive",
        });
        return;
      }
      
      await addToCart({
        listingId: id || '',
        title,
        price,
        image: images[0] || '',
        quantity: 1,
        userId: user.id,
        sellerId: userId || ''
      });
      
      toast({
        title: "Added to cart",
        description: "Item added to your cart",
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle "Buy Now" click
  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="space-y-3 md:space-y-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-lg md:text-3xl font-bold break-words">{title}</h1>
          <p className="text-xl md:text-4xl font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
          {adNumber && (
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                {adNumber}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2" 
                onClick={() => copyToClipboard(adNumber)}
              >
                <Copy className="h-3 w-3 mr-1" />
                <span className="text-xs">Copy</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2 self-end md:self-start">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
            onClick={handleShare}
          >
            <Share2 className={`h-4 w-4 md:h-5 md:w-5 ${copying ? 'text-primary' : 'text-foreground'}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-foreground hover:text-primary" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 md:h-4 md:w-4" />
          <span>{displayLocation}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 md:h-4 md:w-4" />
          <span>{viewCount} views</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          {condition}
        </Badge>
        {brand && (
          <Badge variant="outline" className="bg-gray-100">
            {brand}
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="w-full"
          onClick={handleBuyNow}
          disabled={addingToCart}
        >
          Buy Now
        </Button>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
      
      <div className="bg-muted/40 p-4 rounded-md border border-muted-foreground/10">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> This platform charges a 10% commission fee on all sales. The seller receives 90% of the listed price. All items are verified by our team before being dispatched.
        </p>
      </div>

      {/* Product Specifications Card */}
      <ProductSpecsCard 
        brand={brand}
        specs={specs}
        category={category}
        condition={condition}
      />

      {/* Product Description Card */}
      <Card className="p-3 md:p-4 max-w-full hover:shadow-md transition-shadow">
        <div className="space-y-2 md:space-y-4">
          <h2 className="font-semibold text-sm md:text-base">Description</h2>
          <p className="text-black whitespace-pre-wrap text-xs md:text-sm break-words max-w-full overflow-x-hidden">{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default ProductInfo;
