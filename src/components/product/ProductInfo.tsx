
import { Heart, Share2, MapPin, Calendar, Clock, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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

  // Helper function to format specs values for display
  const formatSpecValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'Not specified';
    
    // Format specific keys
    switch(key) {
      case 'year':
        return value.toString();
      case 'fuel_type':
      case 'transmission':
      case 'furnishing':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'bedrooms':
        return `${value} ${value === 1 ? 'Bedroom' : 'Bedrooms'}`;
      case 'bathrooms':
        return `${value} ${value === 1 ? 'Bathroom' : 'Bathrooms'}`;
      default:
        return typeof value === 'object' ? JSON.stringify(value) : value.toString();
    }
  };

  // Helper function to get user-friendly label for spec keys
  const getSpecLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      'year': 'Year',
      'fuel_type': 'Fuel Type',
      'transmission': 'Transmission',
      'color': 'Color',
      'model_number': 'Model Number',
      'warranty': 'Warranty',
      'material': 'Material',
      'dimensions': 'Dimensions',
      'size': 'Size',
      'style': 'Style',
      'bedrooms': 'Bedrooms',
      'bathrooms': 'Bathrooms',
      'area_size': 'Area',
      'furnishing': 'Furnishing',
      'storage': 'Storage',
      'screen_size': 'Screen Size',
      'battery': 'Battery'
    };
    
    return labelMap[key] || key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Check if we have specifications to show
  const hasSpecs = (specs && Object.values(specs).some(value => value !== null)) || 
                   (brand) || 
                   (category === 'vehicles' && km_driven !== null);

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
            className="h-8 w-8 md:h-10 md:w-10 rounded-full"
            onClick={handleShare}
          >
            <Share2 className={`h-4 w-4 md:h-5 md:w-5 ${copying ? 'text-primary' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full">
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
        {category === 'vehicles' && km_driven !== null && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 md:h-4 md:w-4" />
            <span>{km_driven.toLocaleString()} km driven</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 md:h-4 md:w-4" />
          <span>{viewCount} views</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          {condition}
        </Badge>
        {km_driven !== null && km_driven > 0 && (
          <Badge variant="outline">
            {km_driven.toLocaleString()} km
          </Badge>
        )}
        {brand && (
          <Badge variant="outline" className="bg-gray-100">
            {brand}
          </Badge>
        )}
      </div>

      <Card className="p-3 md:p-4 max-w-full">
        <div className="space-y-2 md:space-y-4">
          <h2 className="font-semibold text-sm md:text-base">Description</h2>
          <p className="text-black whitespace-pre-wrap text-xs md:text-sm break-words max-w-full overflow-x-hidden">{description}</p>
        </div>
      </Card>

      {/* Display category-specific details if available */}
      {hasSpecs && (
        <Card className="p-3 md:p-4 max-w-full">
          <div className="space-y-2 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-base">Item Details</h2>
            <Table>
              <TableBody>
                {/* Show brand if available */}
                {brand && (
                  <TableRow>
                    <TableCell className="font-medium text-xs md:text-sm py-2">
                      Brand
                    </TableCell>
                    <TableCell className="text-xs md:text-sm py-2">
                      {brand}
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Show km_driven for vehicles */}
                {category === 'vehicles' && km_driven !== null && (
                  <TableRow>
                    <TableCell className="font-medium text-xs md:text-sm py-2">
                      Kilometers Driven
                    </TableCell>
                    <TableCell className="text-xs md:text-sm py-2">
                      {km_driven.toLocaleString()} km
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Show all other specs */}
                {specs && Object.entries(specs)
                  .filter(([_, value]) => value !== null)
                  .map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-xs md:text-sm py-2">
                        {getSpecLabel(key)}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm py-2">
                        {formatSpecValue(key, value)}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductInfo;
