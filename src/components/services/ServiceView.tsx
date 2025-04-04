
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { serviceCategories } from "@/data/serviceCategories";
import { BellRing, LogIn, Wrench, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Layout components
import ServiceLayout from "@/components/services/layout/ServiceLayout";
import ServiceHero from "@/components/services/layout/ServiceHero";
import ServiceFilterBar from "@/components/services/filters/ServiceFilterBar";

// Service components
import ServiceCategories from "@/components/services/ServiceCategories";
import ServiceSubcategoryView from "@/components/services/ServiceSubcategoryView";
import PopularServices from "@/components/services/PopularServices";
import PromoBanner from "@/components/services/PromoBanner";
import HowItWorks from "@/components/services/HowItWorks";
import ServiceGuarantee from "@/components/services/ServiceGuarantee";
import RecentlyViewedServices from "@/components/services/RecentlyViewedServices";
import ServiceRequestsMenu from "@/components/services/ServiceRequestsMenu";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/use-session-user";
import ServiceCenterAuth from "@/services/ServiceCenterAuth";

const ServiceView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();
  const [requestCount, setRequestCount] = useState(0);
  const { user, session, loading } = useSession();
  const [isServiceProvider, setIsServiceProvider] = useState(false);

  // State to track recently viewed services
  const [recentlyViewed, setRecentlyViewed] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Save current location in localStorage for consistent navigation
    localStorage.setItem('lastServiceLocation', location.pathname);
    
    // Check if user is a service provider
    const checkServiceProvider = async () => {
      if (session) {
        try {
          const isProvider = await ServiceCenterAuth.isServiceProvider();
          setIsServiceProvider(isProvider);
          
          // If user is a service provider, redirect them to the service center dashboard
          if (isProvider && location.pathname === '/') {
            navigate('/service-center/dashboard');
          }
        } catch (error) {
          console.error("Error checking service provider status:", error);
          setIsServiceProvider(false);
        }
      }
    };

    checkServiceProvider();
    
    // Load recently viewed services from localStorage
    const storedRecent = localStorage.getItem('recentlyViewedServices');
    if (storedRecent) {
      try {
        setRecentlyViewed(JSON.parse(storedRecent));
      } catch (e) {
        console.error("Error parsing recent services", e);
      }
    }
    
    // Get service request count from local storage
    const requests = localStorage.getItem('serviceRequests');
    if (requests) {
      try {
        setRequestCount(JSON.parse(requests).length);
      } catch (e) {
        console.error("Error parsing service requests", e);
      }
    }
    
    // Load location from localStorage for consistency
    const savedLocation = localStorage.getItem('serviceSelectedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, [session, navigate, location.pathname]);

  const saveToRecentlyViewed = (serviceId: string, serviceName: string) => {
    const newRecent = [
      { id: serviceId, name: serviceName },
      ...recentlyViewed.filter(item => item.id !== serviceId).slice(0, 4)
    ];
    
    setRecentlyViewed(newRecent);
    localStorage.setItem('recentlyViewedServices', JSON.stringify(newRecent));
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = serviceCategories.find(c => c.id === categoryId);
    if (category) {
      saveToRecentlyViewed(categoryId, category.name);
    }
    setSelectedCategory(categoryId || null);
  };

  const handlePopularServiceSelect = (serviceId: string, serviceName: string) => {
    // Extract the category and service ID from the combined serviceId
    const [category, service] = serviceId.split('-');
    saveToRecentlyViewed(serviceId, serviceName);
    
    // Navigate to the service detail page
    navigate(`/services/${category}/${service}`);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Define a handler function for LocationSelector
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    localStorage.setItem('serviceSelectedLocation', value);
  };

  const handleLogin = () => {
    navigate('/auth');
  };
  
  // Navigate back to previous page or home
  const handleGoBack = () => {
    const lastLocation = localStorage.getItem('lastServiceLocation');
    if (lastLocation && lastLocation !== location.pathname) {
      navigate(lastLocation);
    } else {
      navigate('/');
    }
  };

  // Show the service connector component to regular users, not service providers
  const shouldShowServiceConnector = session && !isServiceProvider;

  // Floating action button for My Requests (visible only when logged in and not a service provider)
  const RequestsFloatingButton = () => {
    if (!session || isServiceProvider) return null;
    
    return (
      <div className="fixed bottom-20 right-4 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              size="sm" 
              className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
            >
              <BellRing className="h-5 w-5" />
              {requestCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 hover:bg-red-600 p-0"
                >
                  {requestCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary" />
                My Service Requests
              </SheetTitle>
              <SheetDescription>
                View and manage your service requests
              </SheetDescription>
            </SheetHeader>
            <ServiceRequestsMenu />
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  // If user is a service provider, redirect to service center directly
  if (!loading && isServiceProvider && location.pathname === '/') {
    navigate('/service-center/dashboard');
    return null;
  }

  return (
    <div className="relative">
      <ServiceLayout>
        {location.pathname !== '/' && (
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="flex items-center gap-1 text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}
        
        <ServiceHero 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
        />

        {selectedCategory ? (
          <ServiceSubcategoryView 
            categoryId={selectedCategory}
            onBack={handleBackToCategories}
          />
        ) : (
          <>
            <ServiceFilterBar 
              activeFilter={activeFilter} 
              onFilterChange={handleFilterChange} 
            />
            
            <PromoBanner />
            
            <ServiceCategories 
              searchQuery={searchQuery}
              onSelectCategory={handleCategorySelect}
              selectedCategory={null}
            />
            
            <PopularServices onSelectService={handlePopularServiceSelect} />
            
            {recentlyViewed.length > 0 && (
              <RecentlyViewedServices 
                recentlyViewed={recentlyViewed}
                onSelectRecent={handleCategorySelect}
              />
            )}
            
            <Separator className="my-8" />
            
            <HowItWorks />
            <ServiceGuarantee />
            
            {session && !isServiceProvider ? (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <Wrench className="h-7 w-7 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-blue-800">Hire Service Professionals</h3>
                      <p className="text-blue-700/80">
                        Book verified service professionals for all your home and business needs
                      </p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => navigate('/services/search')}
                      >
                        Book a Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <Briefcase className="h-7 w-7 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-purple-800">Become a Service Provider</h3>
                      <p className="text-purple-700/80">
                        Apply to become a service professional and start receiving job requests
                      </p>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => navigate('/service-center')}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : !session ? (
              <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Sign in to access service features</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Sign in to book services, track your service requests, and access more features.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/profile')}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
        
        {/* Floating action button for requests - only for regular users, not service providers */}
        <RequestsFloatingButton />
      </ServiceLayout>
    </div>
  );
};

export default ServiceView;
