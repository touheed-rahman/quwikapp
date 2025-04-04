
import { useServiceView } from "@/hooks/useServiceView";
import ServiceLayout from "@/components/services/layout/ServiceLayout";
import ServiceHero from "@/components/services/layout/ServiceHero";
import ServiceBackButton from "@/components/services/ServiceBackButton";
import ServiceMainContent from "@/components/services/ServiceMainContent";
import RequestsFloatingButton from "@/components/services/RequestsFloatingButton";

const ServiceView = () => {
  const {
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
    handleGoBack,
    navigate,
    location
  } = useServiceView();

  // If user is a service provider, redirect to service center directly
  if (!loading && isServiceProvider && location.pathname === '/') {
    navigate('/service-center/dashboard');
    return null;
  }

  return (
    <div className="relative">
      <ServiceLayout>
        <ServiceBackButton 
          onBack={handleGoBack} 
          showButton={location.pathname !== '/'} 
        />
        
        <ServiceHero 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
        />

        <ServiceMainContent 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          recentlyViewed={recentlyViewed}
          session={session}
          isServiceProvider={isServiceProvider}
          onCategorySelect={handleCategorySelect}
          onPopularServiceSelect={handlePopularServiceSelect}
          onBackToCategories={handleBackToCategories}
          onFilterChange={handleFilterChange}
        />
        
        {/* Floating action button for requests - only for regular users, not service providers */}
        <RequestsFloatingButton 
          session={session}
          isServiceProvider={isServiceProvider}
          requestCount={requestCount}
        />
      </ServiceLayout>
    </div>
  );
};

export default ServiceView;
