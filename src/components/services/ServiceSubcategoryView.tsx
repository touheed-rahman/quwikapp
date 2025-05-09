
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";
import { servicePricing } from "@/types/serviceTypes";
import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import { ArrowLeft, ArrowRight, Star, Clock, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

type ServiceSubcategoryViewProps = {
  categoryId: string;
  onBack: () => void;
  initialService?: string | null;
  directBooking?: boolean;
};

const ServiceSubcategoryView = ({ 
  categoryId, 
  onBack, 
  initialService = null,
  directBooking = false
}: ServiceSubcategoryViewProps) => {
  const [selectedSubservice, setSelectedSubservice] = useState<string | null>(initialService);
  const [selectedSubserviceName, setSelectedSubserviceName] = useState<string>("");
  const [bookingStep, setBookingStep] = useState<number>(directBooking && initialService ? 1 : 0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const categoryDetails = serviceCategories.find(c => c.id === categoryId);
  
  useEffect(() => {
    if (initialService && categoryDetails) {
      const subservice = categoryDetails.subservices.find(s => s.id === initialService);
      if (subservice) {
        setSelectedSubserviceName(subservice.name);
        setSelectedSubservice(initialService);
        if (directBooking) {
          setBookingStep(1);
        }
      }
    }
  }, [initialService, categoryDetails, directBooking]);
  
  if (!categoryDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Category not found</h2>
        <Button onClick={onBack}>Back to all services</Button>
      </div>
    );
  }
  
  const handleSubserviceSelect = (subserviceId: string, subserviceName: string) => {
    // Navigate to the individual service page
    navigate(`/services/${categoryId}/${subserviceId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectBooking = (subserviceId: string, subserviceName: string) => {
    setSelectedSubservice(subserviceId);
    setSelectedSubserviceName(subserviceName);
    setBookingStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSubservices = () => {
    setSelectedSubservice(null);
    setSelectedSubserviceName("");
    setBookingStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {bookingStep === 0 ? (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-muted-foreground flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to all services
            </Button>
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {categoryDetails.name}
            </Badge>
          </div>
          
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-semibold">{categoryDetails.name} Services</h2>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">4.8 average rating</span>
              </div>
            </div>
            <p className="text-muted-foreground">Select a specific service to book a professional</p>
          
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
            >
              {categoryDetails.subservices.map((subservice) => {
                const pricing = getEstimatedAmount(subservice.id);
                const IconComponent = categoryDetails.icon;
                
                return (
                  <motion.div 
                    key={subservice.id} 
                    variants={itemVariants}
                    className="h-full"
                  >
                    <Card 
                      className="h-full overflow-hidden border transition-all duration-300 hover:shadow-md hover:border-primary/30 group"
                    >
                      <div className={`bg-gradient-to-br ${categoryDetails.color} p-4 aspect-[3/2] flex items-center justify-center`}>
                        {IconComponent && <IconComponent className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-base mb-2">{subservice.name}</h3>
                        <Separator className="my-2 bg-primary/10" />
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Starting at</span>
                            <span className="text-primary font-semibold">₹{pricing}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>1-2 hrs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>4.8 (120+)</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button 
                              className="w-full text-xs" 
                              size="sm"
                              onClick={() => handleSubserviceSelect(subservice.id, subservice.name)}
                            >
                              View Details
                            </Button>
                            <Button 
                              className="w-full text-xs" 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDirectBooking(subservice.id, subservice.name)}
                            >
                              Book Now <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
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
