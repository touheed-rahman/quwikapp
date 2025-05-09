
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";
import EnhancedServiceCard from "@/components/services/EnhancedServiceCard";

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-semibold">Explore Service Categories</h2>
        <Badge variant="outline" className="px-3 py-1.5 bg-primary/5 self-start sm:self-auto">
          {filteredServices.length} categories available
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredServices.map((category) => (
          <EnhancedServiceCard
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.id}
            color={category.color}
            subservicesCount={category.subservices.length}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
      
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
