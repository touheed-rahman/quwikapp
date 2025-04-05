
import { motion } from "framer-motion";
import { AlertCircle, Star, Check } from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

type ServiceCategoriesProps = {
  searchQuery: string;
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string | null;
};

const ServiceCategories = ({ 
  searchQuery, 
  onSelectCategory,
  selectedCategory 
}: ServiceCategoriesProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter services based on search query
  const filteredServices = searchQuery 
    ? serviceCategories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subservices.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : serviceCategories;

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    
    setFavorites(prev => {
      if (prev.includes(categoryId)) {
        toast({
          title: "Removed from favorites",
          description: "Service category removed from your favorites",
          duration: 1500,
        });
        return prev.filter(id => id !== categoryId);
      } else {
        toast({
          title: "Added to favorites",
          description: "Service category added to your favorites",
          duration: 1500,
        });
        return [...prev, categoryId];
      }
    });
  };

  // Animation variants
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
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          Explore Service Categories
        </h2>
        <Badge variant="outline" className="px-3 py-1.5 bg-primary/5 self-start sm:self-auto">
          {filteredServices.length} categories available
        </Badge>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredServices.map((category) => {
          const IconComponent = category.icon;
          const isFavorite = favorites.includes(category.id);
          
          return (
            <motion.div 
              key={category.id} 
              variants={item}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <div 
                className="relative h-full overflow-hidden rounded-xl border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-xl group bg-white"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div 
                  className={`${category.color} p-4 sm:p-6 flex items-center justify-center group-hover:saturate-150 transition-all overflow-hidden relative`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {IconComponent && (
                    <div className="relative z-10 transform group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="h-10 w-10 sm:h-12 sm:w-12 text-primary drop-shadow-md" />
                    </div>
                  )}
                  
                  <button 
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-20"
                    onClick={(e) => toggleFavorite(e, category.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>
                
                <div className="p-4 text-center space-y-2 relative z-10">
                  <h3 className="font-medium text-base sm:text-lg">{category.name}</h3>
                  
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-primary/5 text-xs px-2 py-0.5">
                      {category.subservices.length} services
                    </Badge>
                    
                    <div className="flex items-center text-xs text-yellow-500">
                      <Star className="h-3 w-3 fill-yellow-500 mr-0.5" />
                      <span>4.8</span>
                    </div>
                  </div>
                  
                  <Separator className="my-2 bg-primary/10" />
                  
                  <div className="flex flex-wrap justify-center gap-1.5 text-xs text-muted-foreground">
                    {category.subservices.slice(0, 3).map((subservice, idx) => (
                      <Badge key={idx} variant="outline" className="bg-muted/50 font-normal">
                        {subservice.name}
                      </Badge>
                    ))}
                    {category.subservices.length > 3 && (
                      <Badge variant="outline" className="bg-muted/50 font-normal">
                        +{category.subservices.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-2">
                    <div className="text-xs flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-5 w-5 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px] text-gray-600">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-muted-foreground">Active professionals</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-lg border">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceCategories;
