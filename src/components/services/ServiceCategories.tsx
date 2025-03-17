
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/data/serviceCategories";

type ServiceCategoriesProps = {
  searchQuery: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubservice: (subserviceId: string, subserviceName: string) => void;
  selectedCategory: string | null;
};

const ServiceCategories = ({ 
  searchQuery, 
  onSelectCategory, 
  onSelectSubservice, 
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
      {selectedCategory ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground flex items-center gap-1"
              onClick={() => onSelectCategory("")}
            >
              <span>←</span> Back to all services
            </Button>
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {serviceCategories.find(c => c.id === selectedCategory)?.name}
            </Badge>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Select a specific service</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {serviceCategories.find(c => c.id === selectedCategory)?.subservices.map((subservice) => (
              <motion.div 
                key={subservice.id} 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card 
                  className="h-full overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/30"
                  onClick={() => onSelectSubservice(subservice.id, subservice.name)}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    <h3 className="font-medium text-lg mt-3">{subservice.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">Professional service at your doorstep</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredServices.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.div 
                  key={category.id} 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Card 
                    className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-lg"
                    onClick={() => onSelectCategory(category.id)}
                  >
                    <div className={`bg-gradient-to-br ${category.color} p-6 flex items-center justify-center`}>
                      <IconComponent className="h-12 w-12 text-primary" />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">Professional service at your doorstep</p>
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
        </>
      )}
    </motion.div>
  );
};

export default ServiceCategories;
