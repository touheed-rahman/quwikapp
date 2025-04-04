
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/use-session-user";
import ServiceCenterAuth from "@/services/ServiceCenterAuth";

export function useServiceView() {
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

  return {
    selectedLocation,
    searchQuery,
    selectedCategory,
    activeFilter,
    requestCount,
    session,
    loading,
    isServiceProvider,
    recentlyViewed,
    setSearchQuery,
    handleCategorySelect,
    handlePopularServiceSelect,
    handleBackToCategories,
    handleFilterChange,
    handleLocationChange,
    handleLogin,
    handleGoBack,
    navigate,
    location
  };
}

// Need to import this at the top
import { serviceCategories } from "@/data/serviceCategories";
