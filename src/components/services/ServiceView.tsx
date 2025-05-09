
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { serviceCategories } from "@/data/serviceCategories";
import { motion } from "framer-motion";

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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const ServiceView = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();

  // State to track recently viewed services
  const [recentlyViewed, setRecentlyViewed] = useState<{id: string, name: string}[]>([]);
  // State to track direct booking form visibility
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<string | null>(null);
  const [bookingService, setBookingService] = useState<string | null>(null);

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
    
    // Smooth scroll to top when category is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setShowBookingForm(false);
    
    // Smooth scroll to top when going back to categories
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Define a handler function for LocationSelector
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  // Handle direct booking from promo banner
  const handleDirectBooking = (categoryId: string, serviceId: string | null = null) => {
    setBookingCategory(categoryId);
    setBookingService(serviceId);
    setShowBookingForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ServiceLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-full overflow-x-hidden"
      >
        <motion.div variants={fadeIn}>
          <ServiceHero 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        </motion.div>

        {showBookingForm ? (
          <motion.div variants={fadeIn} className="mt-8">
            <ServiceSubcategoryView 
              categoryId={bookingCategory || ""}
              onBack={handleBackToCategories}
              initialService={bookingService}
              directBooking={true}
            />
          </motion.div>
        ) : selectedCategory ? (
          <motion.div variants={fadeIn} className="mt-8">
            <ServiceSubcategoryView 
              categoryId={selectedCategory}
              onBack={handleBackToCategories}
            />
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} className="space-y-12 px-0 sm:px-4">
            <motion.div variants={fadeIn}>
              <ServiceFilterBar 
                activeFilter={activeFilter} 
                onFilterChange={handleFilterChange} 
              />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <PromoBanner onDirectBooking={handleDirectBooking} />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <ServiceCategories 
                searchQuery={searchQuery}
                onSelectCategory={handleCategorySelect}
                selectedCategory={null}
              />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <PopularServices onSelectService={handlePopularServiceSelect} />
            </motion.div>
            
            {recentlyViewed.length > 0 && (
              <motion.div variants={fadeIn}>
                <RecentlyViewedServices 
                  recentlyViewed={recentlyViewed}
                  onSelectRecent={handleCategorySelect}
                />
              </motion.div>
            )}
            
            <motion.div variants={fadeIn}>
              <HowItWorks />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <ServiceGuarantee />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </ServiceLayout>
  );
};

export default ServiceView;
