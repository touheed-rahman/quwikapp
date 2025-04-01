
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";
import { servicePricing } from "@/types/serviceTypes";
import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import { ArrowLeft, Star, Clock, Shield, Users, Zap, CheckCircle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [favoriteServices, setFavoriteServices] = useState<string[]>([]);
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
  
  const toggleFavorite = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    
    setFavoriteServices(prev => {
      if (prev.includes(serviceId)) {
        toast({
          title: "Removed from favorites",
          description: "Service removed from your favorites",
          duration: 1500,
        });
        return prev.filter(id => id !== serviceId);
      } else {
        toast({
          title: "Added to favorites",
          description: "Service added to your favorites",
          duration: 1500,
        });
        return [...prev, serviceId];
      }
    });
  };
  
  // Random benefits for services - will be assigned to each card
  const benefitsList = [
    { icon: Shield, text: "Warranty" },
    { icon: Users, text: "Verified Pros" },
    { icon: Zap, text: "Quick Service" },
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
          <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-md py-3 px-4 -mx-4 border-b shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2 max-w-7xl mx-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Badge variant="outline" className="bg-primary/5 text-primary">
                {categoryDetails.name}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                {categoryDetails.name} Services
              </h2>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">4.8 average rating</span>
              </div>
            </div>
            <p className="text-muted-foreground">Select a specific service to book a professional</p>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {categoryDetails.subservices.map((subservice, index) => {
                const pricing = getEstimatedAmount(subservice.id);
                const IconComponent = categoryDetails.icon;
                const isFavorite = favoriteServices.includes(subservice.id);
                
                // Randomly select 2 benefits for this service
                const randomBenefits = [...benefitsList]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2);
                
                return (
                  <motion.div 
                    key={subservice.id} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full"
                  >
                    <Card 
                      className="h-full overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 group relative"
                    >
                      <button 
                        className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        onClick={(e) => toggleFavorite(e, subservice.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                        />
                      </button>
                      
                      <div 
                        className={`p-5 text-center relative overflow-hidden ${categoryDetails.color}`}
                        onClick={() => handleSubserviceSelect(subservice.id, subservice.name)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
                        <div className="relative z-10">
                          {index % 4 === 0 && (
                            <Badge variant="default" className="mb-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs shadow-sm">
                              Popular
                            </Badge>
                          )}
                          
                          <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-white/90 shadow-md group-hover:shadow-lg transition-all">
                            {IconComponent && <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />}
                          </div>
                          
                          <h3 className="font-semibold text-lg">{subservice.name}</h3>
                        </div>
                      </div>
                      
                      <div 
                        className="p-4 space-y-3"
                        onClick={() => handleSubserviceSelect(subservice.id, subservice.name)}
                      >
                        <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground text-sm">
                          {randomBenefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <benefit.icon className="h-3.5 w-3.5" />
                              <span>{benefit.text}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>1-2 hrs</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">4.8</span>
                            <span className="text-muted-foreground">(120+)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Starting from</div>
                            <div className="text-primary font-bold text-xl">₹{pricing}</div>
                          </div>
                          
                          <Button 
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
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
          timeSlots={[]}
          estimatedAmount={getEstimatedAmount(selectedSubservice)}
        />
      )}
    </motion.div>
  );
};

export default ServiceSubcategoryView;
