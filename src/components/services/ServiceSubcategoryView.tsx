
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { serviceCategories } from "@/data/serviceCategories";
import { ChevronLeft, Star, Calendar, Clock, MapPin, Shield, Users, SparkleIcon } from "lucide-react";
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
    // Find the category from the serviceCategories data
    const foundCategory = serviceCategories.find(cat => cat.id === categoryId);
    
    if (foundCategory) {
      console.log("Found category:", foundCategory);
      setCategory(foundCategory);
    } else {
      console.error("Category not found for ID:", categoryId);
    }
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
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-primary/10 rounded w-48 mb-4"></div>
          <div className="h-4 bg-primary/10 rounded w-64"></div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-primary/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Access the correct subcategories field from the category
  const subcategories = category.subservices || [];
  
  if (subcategories.length === 0) {
    console.error("No subcategories found for category:", category);
  }

  // Animated container for subcategories
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

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

      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 mb-6">
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-medium mb-2">Professional {category.name} Services</h3>
          <p className="text-muted-foreground max-w-3xl">
            {category.description || `Choose from our range of professional ${category.name.toLowerCase()} services tailored to your needs. Our certified experts deliver high-quality services at competitive prices.`}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span>Top Rated Services</span>
            </div>
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>On-time Service</span>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-12 -bottom-12 h-48 w-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute right-24 -top-12 h-32 w-32 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      {subcategories.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No services available for this category.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {subcategories.map((subcat: any) => {
            // Get the price from servicePricing if available
            const price = servicePricing[categoryId]?.[subcat.id] || 499;
            const discountedPrice = Math.round(price * 0.85);
            const hasDiscount = Math.random() > 0.7;
            
            return (
              <motion.div key={subcat.id} variants={item}>
                <Card 
                  className="overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg group h-full"
                >
                  <div className="relative h-36 sm:h-48 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 p-5">
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs shadow-sm">
                      <Users className="h-3 w-3 text-primary" />
                      <span>Most Booked</span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 space-y-1.5">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{subcat.name}</h3>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({Math.floor(Math.random() * 200) + 50})</span>
                      </div>
                    </div>
                    
                    {hasDiscount && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium">15% OFF</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-5 space-y-4">                
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-primary font-bold text-2xl">
                          ₹{hasDiscount ? discountedPrice : price}
                          {hasDiscount && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">₹{price}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">Starting price includes all taxes</div>
                      </div>
                      
                      <Button 
                        onClick={() => handleBookService(subcat.id)}
                        className="px-5 py-2 h-10 bg-primary hover:bg-primary/90 font-medium text-white"
                      >
                        Book Now
                      </Button>
                    </div>

                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{Math.floor(Math.random() * 2) + 1}-{Math.floor(Math.random() * 2) + 2} hrs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Next day available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>At your location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>30-day warranty</span>
                      </div>
                    </div>

                    {subcat.tags && subcat.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {subcat.tags.slice(0, 3).map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <SparkleIcon className="h-3.5 w-3.5 text-amber-500" />
                        <span>Over 500+ happy customers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceSubcategoryView;
