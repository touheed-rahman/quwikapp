import { Separator } from "@/components/ui/separator";
import ServiceFilterBar from "@/components/services/filters/ServiceFilterBar";
import ServiceCategories from "@/components/services/ServiceCategories";
import PopularServices from "@/components/services/PopularServices";
import RecentlyViewedServices from "@/components/services/RecentlyViewedServices";
import HowItWorks from "@/components/services/HowItWorks";
import ServiceGuarantee from "@/components/services/ServiceGuarantee";
import PromoBanner from "@/components/services/PromoBanner";
import ServiceCTASection from "@/components/services/ServiceCTASection";
import ServiceSubcategoryView from "@/components/services/ServiceSubcategoryView";

type ServiceMainContentProps = {
  selectedCategory: string | null;
  searchQuery: string;
  activeFilter: string;
  recentlyViewed: {id: string, name: string}[];
  session: any;
  isServiceProvider: boolean;
  onCategorySelect: (categoryId: string) => void;
  onPopularServiceSelect: (serviceId: string, serviceName: string) => void;
  onBackToCategories: () => void;
  onFilterChange: (filter: string) => void;
};

const ServiceMainContent = ({ 
  selectedCategory,
  searchQuery,
  activeFilter,
  recentlyViewed,
  session,
  isServiceProvider,
  onCategorySelect,
  onPopularServiceSelect,
  onBackToCategories,
  onFilterChange
}: ServiceMainContentProps) => {
  // If a category is selected, show the subcategory view
  if (selectedCategory) {
    return (
      <ServiceSubcategoryView 
        categoryId={selectedCategory}
        onBack={onBackToCategories}
      />
    );
  }

  // Otherwise show the main service browse view
  return (
    <>
      <ServiceFilterBar 
        activeFilter={activeFilter} 
        onFilterChange={onFilterChange} 
      />
      
      <PromoBanner />
      
      <ServiceCategories 
        searchQuery={searchQuery}
        onSelectCategory={onCategorySelect}
        selectedCategory={null}
      />
      
      <PopularServices onSelectService={onPopularServiceSelect} />
      
      {recentlyViewed.length > 0 && (
        <RecentlyViewedServices 
          recentlyViewed={recentlyViewed}
          onSelectRecent={onCategorySelect}
        />
      )}
      
      <Separator className="my-8" />
      
      <HowItWorks />
      <ServiceGuarantee />
      
      <ServiceCTASection 
        session={session} 
        isServiceProvider={isServiceProvider} 
      />
    </>
  );
};

export default ServiceMainContent;
