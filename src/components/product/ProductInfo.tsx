
import { Heart, Share2, MapPin, Calendar, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import ProductSpecsCard from "./ProductSpecsCard";

interface ProductInfoProps {
  title: string;
  price: number;
  location: string;
  createdAt: string;
  condition: ProductCondition;
  description: string;
  category?: string;
  km_driven?: number | null;
  adNumber?: string;
  id?: string;
  viewCount?: number;
  brand?: string | null;
  specs?: Record<string, any> | null;
}

const ProductInfo = ({
  title,
  price,
  location,
  createdAt,
  condition,
  description,
  category,
  km_driven,
  adNumber,
  id,
  viewCount = 0,
  brand,
  specs
}: ProductInfoProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);
  
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
            className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={handleShare}
          >
            <Share2 className={`h-4 w-4 md:h-5 md:w-5 ${copying ? 'text-primary' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5" />
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
        {km_driven !== null && km_driven !== undefined && (
          <Badge variant="outline" className="bg-gray-100">
            {km_driven.toLocaleString()} km
          </Badge>
        )}
      </div>

      {/* Product Specifications Card */}
      <ProductSpecsCard 
        brand={brand}
        specs={specs}
        km_driven={km_driven}
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
