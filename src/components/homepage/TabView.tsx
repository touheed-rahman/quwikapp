
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, ShoppingBag } from "lucide-react";
import RecentListings from "@/components/listings/RecentListings";
import { Listing } from "@/hooks/useListings";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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

  return (
    <Card className="w-full mb-5 p-4 border border-border/30 shadow-sm">
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
              className="rounded-full flex items-center gap-2 text-base font-medium h-10 data-[state=active]:bg-background data-[state=active]:shadow"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Classified</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="services" 
              className="rounded-full flex items-center gap-2 text-base font-medium h-10 data-[state=active]:bg-background data-[state=active]:shadow"
            >
              <Newspaper className="h-5 w-5" />
              <span>Service Now</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="classified" className="mt-3">
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
          
          <TabsContent value="services" className="mt-3">
            {serviceListings.length === 0 && !isLoading ? (
              <div className="text-center py-8 space-y-3">
                <div className="text-lg font-medium">No services found</div>
                <p className="text-sm text-muted-foreground">
                  There are no service listings available yet.
                </p>
              </div>
            ) : (
              <RecentListings
                listings={serviceListings}
                isLoading={isLoading}
                error={error}
                showAllProducts={showAllProducts}
                setShowAllProducts={setShowAllProducts}
                getFirstImageUrl={getFirstImageUrl}
                itemsPerPage={itemsPerPage}
              />
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </Card>
  );
};

export default TabView;
