
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { serviceCategories } from "@/data/serviceCategories";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ServiceSubcategoryHeader from "./ServiceSubcategoryHeader";
import ServiceCategoryBanner from "./ServiceCategoryBanner";
import ServiceSubcategoryCard from "./ServiceSubcategoryCard";
import ServiceSubcategoryLoading from "./ServiceSubcategoryLoading";
import EmptySubcategories from "./EmptySubcategories";

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
    return <ServiceSubcategoryLoading />;
  }

  // Access the correct subcategories field from the category
  const subcategories = category.subservices || [];
  
  if (subcategories.length === 0) {
    console.error("No subcategories found for category:", category);
    return <EmptySubcategories />;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ServiceSubcategoryHeader 
        categoryName={category.name} 
        onBack={onBack} 
      />

      <ServiceCategoryBanner 
        categoryName={category.name} 
        description={category.description} 
      />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {subcategories.map((subcat: any) => (
          <ServiceSubcategoryCard
            key={subcat.id}
            categoryId={categoryId}
            subcategory={subcat}
            onBookService={handleBookService}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ServiceSubcategoryView;
