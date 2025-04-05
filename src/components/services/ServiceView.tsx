
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { serviceCategories } from "@/data/serviceCategories";

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

const ServiceView = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();

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

  return (
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
          
          <RecentlyViewedServices 
            recentlyViewed={recentlyViewed}
            onSelectRecent={handleCategorySelect}
          />
          
          <HowItWorks />
          <ServiceGuarantee />
        </>
      )}
    </ServiceLayout>
  );
};

export default ServiceView;
