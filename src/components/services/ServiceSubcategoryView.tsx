
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { serviceCategories } from "@/data/serviceCategories";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { servicePricing } from "@/types/serviceTypes";
import ServiceSubcategoryCard from "./ServiceSubcategoryCard";

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
        <p className="text-muted-foreground">Loading category...</p>
      </div>
    );
  }

  // Access the correct subcategories field from the category
  const subcategories = category.subservices || [];
  
  if (subcategories.length === 0) {
    console.error("No subcategories found for category:", category);
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

      {subcategories.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No services available for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {subcategories.map((subcat: any) => {
            // Get the price from servicePricing if available
            const price = servicePricing[categoryId]?.[subcat.id] || 499;
            
            return (
              <ServiceSubcategoryCard
                key={subcat.id}
                id={subcat.id}
                name={subcat.name}
                tags={subcat.tags}
                price={price}
                onBookService={handleBookService}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ServiceSubcategoryView;
