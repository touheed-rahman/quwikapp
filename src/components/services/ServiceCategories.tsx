
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

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
      
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredServices.map((category) => {
          const IconComponent = category.icon;
          return (
            <motion.div 
              key={category.id} 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }} 
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card 
                className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-lg group"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`bg-gradient-to-br ${category.color} p-4 flex items-center justify-center group-hover:saturate-150 transition-all`}>
                  {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-base">{category.name}</h3>
                  <Separator className="my-2 bg-primary/10" />
                  <div className="flex items-center justify-center mt-2">
                    <Badge variant="outline" className="bg-primary/5 text-xs px-2 py-0.5">
                      {category.subservices.length} services
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
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
