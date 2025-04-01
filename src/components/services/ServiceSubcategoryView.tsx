
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";
import { servicePricing } from "@/types/serviceTypes";
import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import { ArrowLeft, ArrowRight, Star, Clock, Calendar, Shield, Users, Zap, Award, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

type ServiceSubcategoryViewProps = {
  categoryId: string;
  onBack: () => void;
};

const ServiceSubcategoryView = ({ categoryId, onBack }: ServiceSubcategoryViewProps) => {
  const [selectedSubservice, setSelectedSubservice] = useState<string | null>(null);
  const [selectedSubserviceName, setSelectedSubserviceName] = useState<string>("");
  const [bookingStep, setBookingStep] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const categoryDetails = serviceCategories.find(c => c.id === categoryId);
  
  if (!categoryDetails) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-xl font-semibold mb-2">Category not found</h2>
        <Button onClick={onBack}>Back to all services</Button>
      </motion.div>
    );
  }
  
  const handleSubserviceSelect = (subserviceId: string, subserviceName: string) => {
    // Navigate to the individual service page
    navigate(`/services/${categoryId}/${subserviceId}`);
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

  // Random benefits for services - will be assigned to each card
  const benefitsList = [
    { icon: Shield, text: "Warranty" },
    { icon: Users, text: "Verified Pros" },
    { icon: Zap, text: "Quick Service" },
    { icon: Award, text: "Best Price" },
    { icon: CheckCircle, text: "Satisfaction" }
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
          <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md py-3 px-4 -mx-4 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2 max-w-7xl mx-auto">
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
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
                {categoryDetails.name} Services
              </h2>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">4.8 average rating</span>
              </div>
            </div>
            <p className="text-muted-foreground">Select a specific service to book a professional</p>
          
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {categoryDetails.subservices.map((subservice, index) => {
                const pricing = getEstimatedAmount(subservice.id);
                const IconComponent = categoryDetails.icon;
                // Randomly select 1-2 benefits for this service
                const randomBenefits = [...benefitsList]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2);
                
                return (
                  <motion.div 
                    key={subservice.id} 
                    variants={item}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full"
                  >
                    <Card 
                      className="h-full overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 group"
                      onClick={() => handleSubserviceSelect(subservice.id, subservice.name)}
                    >
                      <div className="p-6 pb-4 text-center relative">
                        <div className={`inline-flex items-center justify-center rounded-full p-3 mb-4 ${categoryDetails.color}`}>
                          {IconComponent && <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />}
                        </div>
                        
                        {index % 4 === 0 && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="default" className="bg-green-500 text-white text-xs">Popular</Badge>
                          </div>
                        )}
                        
                        <h3 className="font-semibold text-lg mb-2">{subservice.name}</h3>
                        <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm mb-4">
                          {randomBenefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <benefit.icon className="h-3.5 w-3.5" />
                              <span>{benefit.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>1-2 hrs</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">4.8</span>
                            <span className="text-muted-foreground">(120+)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Starting from</div>
                            <div className="text-primary font-bold text-xl">₹{pricing}</div>
                          </div>
                          <Button className="bg-primary/90 hover:bg-primary" size="sm">
                            View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
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
