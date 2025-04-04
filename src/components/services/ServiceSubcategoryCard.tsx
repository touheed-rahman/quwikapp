
import { motion } from "framer-motion";
import { Star, Users, Clock, MapPin, Shield, SparkleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { servicePricing } from "@/types/serviceTypes";

interface ServiceSubcategoryCardProps {
  categoryId: string;
  subcategory: {
    id: string;
    name: string;
    tags?: string[];
  };
  onBookService: (subcategoryId: string) => void;
}

const ServiceSubcategoryCard = ({ categoryId, subcategory, onBookService }: ServiceSubcategoryCardProps) => {
  // Get the price from servicePricing if available
  const price = servicePricing[categoryId]?.[subcategory.id] || 499;
  const discountedPrice = Math.round(price * 0.85);
  const hasDiscount = Math.random() > 0.7;

  // Animations
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={item}>
      <Card 
        className="overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg group h-full"
      >
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 p-4">
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs shadow-sm">
            <Users className="h-3 w-3 text-primary" />
            <span className="text-xs">Most Booked</span>
          </div>
          
          <div className="absolute bottom-3 left-3 space-y-1">
            <h3 className="text-base sm:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">{subcategory.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 200) + 50})</span>
            </div>
          </div>
          
          {hasDiscount && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs">15% OFF</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-3 sm:p-4 space-y-3">                
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <div className="text-primary font-bold text-lg sm:text-xl">
                ₹{hasDiscount ? discountedPrice : price}
                {hasDiscount && (
                  <span className="ml-1 text-xs text-muted-foreground line-through">₹{price}</span>
                )}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Incl. taxes</div>
            </div>
            
            <Button 
              onClick={() => onBookService(subcategory.id)}
              className="px-3 sm:px-4 py-1 h-8 sm:h-9 bg-primary hover:bg-primary/90 font-medium text-white text-xs sm:text-sm"
            >
              Book Now
            </Button>
          </div>

          <Separator />
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              <span>{Math.floor(Math.random() * 2) + 1}-{Math.floor(Math.random() * 2) + 2} hrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-primary" />
              <span>At your home</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-primary" />
              <span>30-day warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SparkleIcon className="h-3 w-3 text-amber-500" />
              <span>500+ happy customers</span>
            </div>
          </div>

          {subcategory.tags && subcategory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {subcategory.tags.slice(0, 2).map((tag: string, i: number) => (
                <Badge key={i} variant="outline" className="text-[10px] sm:text-xs bg-primary/5 text-primary border-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceSubcategoryCard;
