
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">Service Categories</h2>
          <p className="text-muted-foreground">Choose from our wide range of professional services</p>
        </div>
        <Badge className="mt-2 md:mt-0 bg-primary/10 text-primary hover:bg-primary/20">
          {serviceCategories.length} Categories Available
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredServices.map((category) => {
          const IconComponent = category.icon;
          return (
            <motion.div 
              key={category.id} 
              whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }} 
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card 
                className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-lg group"
                onClick={() => onSelectCategory(category.id)}
              >
                <div className={`bg-gradient-to-br ${category.color} p-6 flex items-center justify-center group-hover:saturate-150 transition-all`}>
                  <IconComponent className="h-12 w-12 text-primary" />
                </div>
                <CardContent className="p-4 text-center relative">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {category.subservices.length} services available
                  </p>
                  <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-10">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceCategories;
