
import { useSubcategoryData } from "@/hooks/useSubcategoryData";
import Header from "@/components/Header";
import SubcategoryFilters from "@/components/subcategory/SubcategoryFilters";
import FeaturedSubcategoryListings from "@/components/subcategory/FeaturedSubcategoryListings";
import SubcategoryListings from "@/components/subcategory/SubcategoryListings";
import { motion } from "framer-motion";
import { Tag, MapPin } from "lucide-react";

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
      <main className="container mx-auto px-4 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary flex items-center gap-1.5"
            >
              <Tag size={14} />
              <span>{category}</span>
            </motion.div>
            
            {selectedLocation && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-muted rounded-full px-3 py-1 text-sm font-medium text-foreground/70 flex items-center gap-1.5"
              >
                <MapPin size={14} />
                <span>{selectedLocation.split('|')[0]}</span>
              </motion.div>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground/90">
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
        </motion.div>

        {/* Featured listings section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <FeaturedSubcategoryListings 
            category={category} 
            subcategory={subcategory} 
          />
        </motion.div>

        {/* Regular listings section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
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
        </motion.div>
      </main>
    </div>
  );
};

export default SubcategoryPage;
