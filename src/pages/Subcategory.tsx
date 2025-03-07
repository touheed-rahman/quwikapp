
import { useSubcategoryData } from "@/hooks/useSubcategoryData";
import Header from "@/components/Header";
import SubcategoryFilters from "@/components/subcategory/SubcategoryFilters";
import FeaturedSubcategoryListings from "@/components/subcategory/FeaturedSubcategoryListings";
import SubcategoryListings from "@/components/subcategory/SubcategoryListings";

const SubcategoryPage = () => {
  const {
    category,
    subcategory,
    sortBy,
    setSortBy,
    condition,
    setCondition,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    featuredListings,
    priceRange,
    setPriceRange,
    datePosted,
    setDatePosted,
    minPrice,
    maxPrice
  } = useSubcategoryData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {subcategory} in {category}
          </h1>
          
          <SubcategoryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            condition={condition}
            setCondition={setCondition}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            datePosted={datePosted}
            setDatePosted={setDatePosted}
          />
        </div>

        {/* Featured listings section */}
        <FeaturedSubcategoryListings 
          category={category} 
          subcategory={subcategory} 
        />

        {/* Regular listings section */}
        <SubcategoryListings
          category={category}
          subcategory={subcategory}
          sortBy={sortBy}
          condition={condition}
          selectedLocation={selectedLocation}
          searchQuery={searchQuery}
          featuredListings={featuredListings}
          priceRange={priceRange}
          datePosted={datePosted}
        />
      </main>
    </div>
  );
};

export default SubcategoryPage;
