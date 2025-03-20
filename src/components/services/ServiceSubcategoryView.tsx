
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";
import { servicePricing } from "@/types/serviceTypes";
import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import { ArrowLeftIcon } from "lucide-react";

type ServiceSubcategoryViewProps = {
  categoryId: string;
  onBack: () => void;
};

const ServiceSubcategoryView = ({ categoryId, onBack }: ServiceSubcategoryViewProps) => {
  const [selectedSubservice, setSelectedSubservice] = useState<string | null>(null);
  const [selectedSubserviceName, setSelectedSubserviceName] = useState<string>("");
  const [bookingStep, setBookingStep] = useState<number>(0);
  
  const categoryDetails = serviceCategories.find(c => c.id === categoryId);
  
  if (!categoryDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Category not found</h2>
        <Button onClick={onBack}>Back to all services</Button>
      </div>
    );
  }
  
  const handleSubserviceSelect = (subserviceId: string, subserviceName: string) => {
    setSelectedSubservice(subserviceId);
    setSelectedSubserviceName(subserviceName);
    setBookingStep(1);
  };

  const handleBackToSubservices = () => {
    setSelectedSubservice(null);
    setSelectedSubserviceName("");
    setBookingStep(0);
  };
  
  // Get pricing for selected service
  const getEstimatedAmount = (subserviceId: string | null) => {
    if (!subserviceId || !categoryId) return 349; // Default
    return servicePricing[categoryId]?.[subserviceId] || 349;
  };
  
  const timeSlots = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM", 
    "12:00 PM - 02:00 PM", 
    "02:00 PM - 04:00 PM", 
    "04:00 PM - 06:00 PM", 
    "06:00 PM - 08:00 PM"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {bookingStep === 0 ? (
        <>
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={onBack}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to all services
            </Button>
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {categoryDetails.name}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">{categoryDetails.name} Services</h2>
            <p className="text-muted-foreground">Select a specific service to book a professional</p>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {categoryDetails.subservices.map((subservice) => {
                const pricing = getEstimatedAmount(subservice.id);
                
                return (
                  <motion.div 
                    key={subservice.id} 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.98 }}
                    className="h-full"
                  >
                    <Card 
                      className="h-full overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/30 group"
                      onClick={() => handleSubserviceSelect(subservice.id, subservice.name)}
                    >
                      <div className={`bg-gradient-to-br ${categoryDetails.color} p-4 aspect-[3/2] flex items-center justify-center`}>
                        {categoryDetails.icon({ 
                          className: "h-12 w-12 text-primary group-hover:scale-110 transition-transform" 
                        })}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-base mb-2">{subservice.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Starting at</span>
                          <span className="text-primary font-semibold">₹{pricing}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <ServiceBookingForm
          subserviceId={selectedSubservice}
          categoryId={categoryId}
          selectedSubserviceName={selectedSubserviceName}
          onBack={handleBackToSubservices}
          timeSlots={timeSlots}
          estimatedAmount={getEstimatedAmount(selectedSubservice)}
        />
      )}
    </motion.div>
  );
};

export default ServiceSubcategoryView;
