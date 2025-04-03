import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import ServiceConnector from "@/components/services/ServiceConnector";
import { serviceCategories } from "@/data/serviceCategories";
import { servicePricing } from "@/types/serviceTypes";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/use-session-user";

const ServiceDetail = () => {
  const { categoryId, serviceId } = useParams<{ categoryId: string; serviceId: string }>();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();
  const { user, session, loading } = useSession();
  
  const category = serviceCategories.find(c => c.id === categoryId);
  const service = category?.subservices.find(s => s.id === serviceId);
  
  useEffect(() => {
    if (!category || !service) {
      toast({
        title: "Service not found",
        description: "The requested service could not be found.",
        variant: "destructive"
      });
      navigate("/");
    }

    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, service, navigate, toast]);
  
  if (!category || !service) {
    return null;
  }
  
  const IconComponent = category.icon;
  const price = servicePricing[categoryId]?.[serviceId] || 349;
  
  const timeSlots = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM", 
    "12:00 PM - 02:00 PM", 
    "02:00 PM - 04:00 PM", 
    "04:00 PM - 06:00 PM", 
    "06:00 PM - 08:00 PM"
  ];
  
  const handleBack = () => {
    navigate(-1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBookService = () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to book a service.",
        variant: "destructive",
      });
      navigate('/profile');
      return;
    }
    setShowBookingForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <>
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-7xl py-6 px-4 space-y-8"
      >
        {showBookingForm ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4 flex items-center gap-1"
              onClick={() => {
                setShowBookingForm(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to service details
            </Button>
            <ServiceBookingForm
              categoryId={categoryId}
              subserviceId={serviceId}
              selectedSubserviceName={service.name}
              onBack={() => {
                setShowBookingForm(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              timeSlots={timeSlots}
              estimatedAmount={price}
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className={`bg-gradient-to-br ${category.color} p-6 w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2 bg-primary/5">
                      {category.name}
                    </Badge>
                    <h1 className="text-3xl font-bold">{service.name}</h1>
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium mr-1">4.8</span>
                      <span className="text-sm">(120+ ratings)</span>
                    </div>
                  </div>
                </div>
                
                <Card className="border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Service Overview</CardTitle>
                    <CardDescription>Everything you need to know about our {service.name} service</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none text-muted-foreground">
                      <p>Our professional {service.name} service provides comprehensive solutions tailored to your specific needs. Our certified technicians bring years of experience and the latest equipment to ensure top-quality service.</p>
                      
                      <h3 className="text-foreground text-lg font-medium mt-4">What's Included:</h3>
                      <ul className="space-y-2 my-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Professional {service.name} by certified technicians</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Standard service visit of up to 2 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Diagnosis and issue identification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Standard repairs and adjustments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Post-service testing and quality check</span>
                        </li>
                      </ul>
                      
                      <h3 className="text-foreground text-lg font-medium mt-4">Additional Information:</h3>
                      <p>For major repairs or replacement parts, additional charges may apply. Our technician will provide a detailed quote before proceeding with any extra work.</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary mb-2" />
                        <h4 className="font-medium">Availability</h4>
                        <p className="text-sm text-muted-foreground">Mon-Sat, 8am-8pm</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                        <Clock className="h-6 w-6 text-primary mb-2" />
                        <h4 className="font-medium">Duration</h4>
                        <p className="text-sm text-muted-foreground">1-2 hours typical</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                        <Shield className="h-6 w-6 text-primary mb-2" />
                        <h4 className="font-medium">Warranty</h4>
                        <p className="text-sm text-muted-foreground">30-day service guarantee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="font-medium">RS</span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">Rahul S.</h4>
                            <div className="flex ml-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 5 ? "text-yellow-500" : "text-gray-300"}`} 
                                  fill={star <= 5 ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Great service! The technician was professional and fixed my issue quickly.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="font-medium">AP</span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">Ananya P.</h4>
                            <div className="flex ml-2">
                              {[1, 2, 3, 4].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 4 ? "text-yellow-500" : "text-gray-300"}`} 
                                  fill={star <= 4 ? "currentColor" : "none"}
                                />
                              ))}
                              <Star className="h-4 w-4 text-gray-300" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Service was good but arrived a bit late. Otherwise, the work quality was excellent.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View All Reviews
                    </Button>
                  </CardContent>
                </Card>
                
                <ServiceConnector 
                  serviceId={serviceId || ""}
                  serviceName={service.name}
                />
              </div>
              
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Book This Service</CardTitle>
                    <CardDescription>Book your {service.name} appointment now</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Service Price</span>
                      <div className="flex items-center gap-1 text-xl font-bold">
                        ₹{price}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">NEW</Badge>
                        <div className="text-xs text-green-800">
                          First-time customers get 10% off! Discount applied automatically at booking.
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
                      <h4 className="font-medium">Available Today</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge variant="outline" className="text-xs py-1 justify-center cursor-pointer hover:bg-primary/10">
                          2:00 PM
                        </Badge>
                        <Badge variant="outline" className="text-xs py-1 justify-center cursor-pointer hover:bg-primary/10">
                          4:00 PM
                        </Badge>
                        <Badge variant="outline" className="text-xs py-1 justify-center cursor-pointer hover:bg-primary/10">
                          6:00 PM
                        </Badge>
                        <Badge variant="outline" className="text-xs py-1 justify-center cursor-pointer hover:bg-primary/10">
                          7:00 PM
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Button className="w-full" size="lg" onClick={handleBookService}>
                      Book Now
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      No payment required until after service completion
                    </p>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Are you a service provider?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/service-center')}
                    >
                      Go to Service Center
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default ServiceDetail;
