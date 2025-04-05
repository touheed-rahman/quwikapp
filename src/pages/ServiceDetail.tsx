
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Star, Shield, Users, Zap, Award, ThumbsUp } from "lucide-react";
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

const ServiceDetail = () => {
  const { categoryId, serviceId } = useParams<{ categoryId: string; serviceId: string }>();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();
  
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
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 rounded-xl">
                  <div className={`bg-gradient-to-br ${category.color} p-6 w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2 bg-primary/5 font-medium">
                      {category.name}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl font-bold">{service.name}</h1>
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <span className="text-sm ml-2">4.8 (120+ ratings)</span>
                      <Badge className="ml-3 bg-green-100 text-green-800 hover:bg-green-200">Trending</Badge>
                    </div>
                  </div>
                </div>
                
                <Card className="border-primary/10 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Service Overview</CardTitle>
                    <CardDescription>Everything you need to know about our {service.name} service</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose max-w-none text-muted-foreground">
                      <p className="text-base">Our professional {service.name} service provides comprehensive solutions tailored to your specific needs. Our certified technicians bring years of experience and the latest equipment to ensure top-quality service.</p>
                      
                      <h3 className="text-foreground text-lg font-medium mt-4">What's Included:</h3>
                      <ul className="space-y-3 my-4">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Professional {service.name}</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Performed by certified technicians with specialized equipment</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Standard service visit (up to 2 hours)</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Thorough service with attention to detail</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Diagnosis and issue identification</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Comprehensive assessment of current problems</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Standard repairs and adjustments</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Quick fixes included in the service package</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Post-service testing and quality check</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Ensuring everything works perfectly before we leave</p>
                          </div>
                        </li>
                      </ul>
                      
                      <h3 className="text-foreground text-lg font-medium mt-6">Additional Information:</h3>
                      <p>For major repairs or replacement parts, additional charges may apply. Our technician will provide a detailed quote before proceeding with any extra work.</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="bg-primary/5 border-primary/10 shadow-none">
                        <CardContent className="flex flex-col items-center text-center p-4">
                          <Calendar className="h-8 w-8 text-primary mb-3" />
                          <h4 className="font-medium">Availability</h4>
                          <p className="text-sm text-muted-foreground">Mon-Sat, 8am-8pm</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/5 border-primary/10 shadow-none">
                        <CardContent className="flex flex-col items-center text-center p-4">
                          <Clock className="h-8 w-8 text-primary mb-3" />
                          <h4 className="font-medium">Duration</h4>
                          <p className="text-sm text-muted-foreground">1-2 hours typical</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/5 border-primary/10 shadow-none">
                        <CardContent className="flex flex-col items-center text-center p-4">
                          <Shield className="h-8 w-8 text-primary mb-3" />
                          <h4 className="font-medium">Warranty</h4>
                          <p className="text-sm text-muted-foreground">30-day service guarantee</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Customer Reviews</CardTitle>
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> 4.8
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary">RS</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Rahul S.</h4>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500"
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Great service! The technician was extremely professional and fixed my issue quickly. 
                            He explained everything and gave helpful tips for maintenance.
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary">AP</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Ananya P.</h4>
                            <span className="text-xs text-muted-foreground">1 week ago</span>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[1, 2, 3, 4].map((star) => (
                              <Star 
                                key={star} 
                                className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500"
                              />
                            ))}
                            <Star className="h-3.5 w-3.5 text-gray-300" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Service was good but the technician arrived a bit late. The work quality was excellent though,
                            and they left the area clean after finishing.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-6" size="sm">
                      View All Reviews
                    </Button>
                  </CardContent>
                </Card>
                
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Our Service Promise</h3>
                      <p className="text-muted-foreground mt-1">We're committed to providing top-quality service. If you're not completely satisfied, we'll make it right.</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 mt-4">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-primary" />
                          <span className="text-sm">Satisfaction Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">Verified Professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm">Fast Response Time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ServiceConnector 
                  serviceId={serviceId || ""}
                  serviceName={service.name}
                />
              </div>
              
              <div className="space-y-6">
                <Card className="sticky top-6 shadow-sm border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Book This Service</CardTitle>
                    <CardDescription>Book your {service.name} appointment now</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Service Price</span>
                      <div className="flex items-center gap-1 text-xl font-bold">
                        ₹{price}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">First-time customer offer</h4>
                          <p className="text-xs text-green-700 mt-0.5">
                            Get 10% off on your first service booking! Discount applied automatically at checkout.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Why book with us?</h4>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Vetted professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Flexible scheduling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">No payment until service completion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">30-day service guarantee</span>
                        </div>
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
                
                <Card className="shadow-sm border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Are you a service provider?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join our network of professional service providers and get connected with customers in your area.
                    </p>
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
