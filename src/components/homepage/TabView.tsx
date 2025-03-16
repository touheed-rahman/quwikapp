
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, ShoppingBag, Wrench, Tv, Lightbulb } from "lucide-react";
import RecentListings from "@/components/listings/RecentListings";
import { Listing } from "@/hooks/useListings";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface TabViewProps {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  showAllProducts: boolean;
  setShowAllProducts: (show: boolean) => void;
  getFirstImageUrl: (images: string[]) => string;
  itemsPerPage: number;
}

const TabView: React.FC<TabViewProps> = ({
  listings,
  isLoading,
  error,
  showAllProducts,
  setShowAllProducts,
  getFirstImageUrl,
  itemsPerPage,
}) => {
  // Filter listings for services
  const serviceListings = listings.filter(listing => 
    listing.category === "Services" || listing.subcategory.toLowerCase().includes("service")
  );
  
  // The remaining listings are considered classified
  const classifiedListings = listings.filter(listing => 
    listing.category !== "Services" && !listing.subcategory.toLowerCase().includes("service")
  );

  const serviceCategories = [
    { id: "appliance", name: "Appliance Repair", icon: <Wrench className="h-8 w-8 text-primary" /> },
    { id: "electronics", name: "Electronics", icon: <Tv className="h-8 w-8 text-primary" /> },
    { id: "electrical", name: "Electrical", icon: <Lightbulb className="h-8 w-8 text-primary" /> },
    { id: "cleaning", name: "Home Cleaning", icon: <Newspaper className="h-8 w-8 text-primary" /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Tabs defaultValue="classified" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4 rounded-full h-12 p-1 bg-muted">
          <TabsTrigger 
            value="classified" 
            className="rounded-full flex items-center gap-2 data-[state=active]:bg-background"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Classified</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="services" 
            className="rounded-full flex items-center gap-2 data-[state=active]:bg-background"
          >
            <Wrench className="h-4 w-4" />
            <span>Service Now</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="classified" className="mt-4">
          <RecentListings
            listings={classifiedListings}
            isLoading={isLoading}
            error={error}
            showAllProducts={showAllProducts}
            setShowAllProducts={setShowAllProducts}
            getFirstImageUrl={getFirstImageUrl}
            itemsPerPage={itemsPerPage}
          />
        </TabsContent>
        
        <TabsContent value="services" className="mt-4">
          {serviceListings.length === 0 && !isLoading ? (
            <div className="text-center py-6 space-y-3">
              <div className="text-lg font-medium">Our Services</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-8">
                {serviceCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="bg-primary/10 rounded-full p-4 mb-2">
                        {category.icon}
                      </div>
                      <h3 className="font-medium text-sm mt-2">{category.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Book trusted service professionals in your area
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {serviceCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="bg-primary/10 rounded-full p-4 mb-2">
                        {category.icon}
                      </div>
                      <h3 className="font-medium text-sm mt-2">{category.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <RecentListings
                listings={serviceListings}
                isLoading={isLoading}
                error={error}
                showAllProducts={showAllProducts}
                setShowAllProducts={setShowAllProducts}
                getFirstImageUrl={getFirstImageUrl}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TabView;
