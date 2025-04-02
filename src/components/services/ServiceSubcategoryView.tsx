
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { serviceCategories } from "@/data/serviceCategories";
import { ChevronLeft, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { servicePricing } from "@/types/serviceTypes";

interface SubcategoryViewProps {
  categoryId: string;
  onBack: () => void;
}

const ServiceSubcategoryView = ({ categoryId, onBack }: SubcategoryViewProps) => {
  const [category, setCategory] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const foundCategory = serviceCategories.find(cat => cat.id === categoryId);
    setCategory(foundCategory);
  }, [categoryId]);

  const handleBookService = (subcategoryId: string) => {
    navigate(`/services/${categoryId}/${subcategoryId}`);
  };

  const showInfoToast = () => {
    toast({
      title: "Service Info",
      description: "This is a preview of our service marketplace. Book a service to see the full experience.",
    });
  };

  if (!category) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Loading category...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">{category.name}</h2>
      </div>

      <p className="text-muted-foreground">{category.description || `Choose from our range of ${category.name.toLowerCase()} services`}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.subcategories?.map((subcat: any) => {
          // Get the price from servicePricing if available
          const price = servicePricing[categoryId]?.[subcat.id] || 499;
          
          return (
            <Card 
              key={subcat.id}
              className="overflow-hidden border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="relative h-24 sm:h-32 bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-base sm:text-lg font-semibold">{subcat.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs sm:text-sm font-medium">{(4 + Math.random()).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 200) + 50} ratings)</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-3 sm:p-4 space-y-3">                
                <div className="flex justify-between items-center">
                  <div className="text-primary font-semibold text-base sm:text-lg">₹{price}</div>
                  
                  <Button 
                    onClick={() => handleBookService(subcat.id)}
                    size="sm"
                    className="text-xs sm:text-sm px-3 sm:px-4 py-1 h-8"
                  >
                    Book Now
                  </Button>
                </div>

                {subcat.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {subcat.tags.slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs bg-primary/5 text-primary/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ServiceSubcategoryView;
