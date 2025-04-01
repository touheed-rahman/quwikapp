
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { serviceCategories } from "@/data/serviceCategories";
import { BellRing, LogIn } from "lucide-react";
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

const ServiceView = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();
  const [requestCount, setRequestCount] = useState(0);
  const { user, session, loading } = useSession();

  // State to track recently viewed services
  const [recentlyViewed, setRecentlyViewed] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
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
  }, []);

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
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="relative">
      {/* Top Menu Button for Service Requests */}
      <div className="sticky top-16 z-30 flex justify-end px-4 py-2 bg-white/80 backdrop-blur-md border-b">
        {session ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 relative bg-gradient-to-r from-primary/5 to-primary/10 hover:bg-primary/10 border-primary/20">
                <BellRing className="h-4 w-4 text-primary" />
                <span className="sr-only sm:not-sr-only text-primary/90">My Requests</span>
                {requestCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 min-w-5 h-5 flex items-center justify-center">
                    {requestCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-primary" />
                  Service Requests
                </SheetTitle>
                <SheetDescription>
                  View and manage your service requests
                </SheetDescription>
              </SheetHeader>
              <ServiceRequestsMenu />
            </SheetContent>
          </Sheet>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-primary/5 to-primary/10 hover:bg-primary/10 border-primary/20"
            onClick={handleLogin}
          >
            <LogIn className="h-4 w-4 text-primary" />
            <span className="text-primary/90">Login for Services</span>
          </Button>
        )}
      </div>

      <ServiceLayout>
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
            
            {!session && (
              <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Register as a Service Provider</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Are you a professional service provider? Join our platform to connect with customers and grow your business.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/service-center')}
                  >
                    Join as Service Provider
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </ServiceLayout>
    </div>
  );
};

export default ServiceView;
