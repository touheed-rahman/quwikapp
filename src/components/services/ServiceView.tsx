import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from "@/components/LocationSelector";
import ServiceCategories from "@/components/services/ServiceCategories";
import HowItWorks from "@/components/services/HowItWorks";
import ServiceGuarantee from "@/components/services/ServiceGuarantee";
import PopularServices from "@/components/services/PopularServices";
import PromoBanner from "@/components/services/PromoBanner";
import ServiceSubcategoryView from "@/components/services/ServiceSubcategoryView";
import { serviceCategories } from "@/data/serviceCategories";
import { useNavigate } from "react-router-dom";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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

  // Filter categories based on the active filter
  const getFilteredCategories = () => {
    if (activeFilter === "all") {
      return serviceCategories;
    }
    
    // Example filters - you can customize based on your needs
    const filterMap: Record<string, string[]> = {
      "home": ["home", "cleaning", "home_improvement"],
      "electronics": ["electronic", "mobile", "tech_services"],
      "professional": ["health", "education"],
      "personal": ["salon", "fashion"]
    };
    
    return serviceCategories.filter(category => 
      filterMap[activeFilter]?.includes(category.id)
    );
  };

  // Define a handler function for LocationSelector
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-primary/20 shadow-lg"
        variants={item}
      >
        <motion.div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text inline-block mb-3">
            Professional Services at Your Doorstep
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Book reliable professionals for all your needs with just a few clicks
          </p>
        </motion.div>

        <motion.div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <LocationSelector 
              value={selectedLocation || ""} 
              onChange={handleLocationChange} 
            />
          </div>
          <div className="w-full md:w-1/2 relative">
            <Input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 w-full border-primary/20 rounded-lg focus:ring-primary focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          </div>
        </motion.div>
      </motion.div>

      {selectedCategory ? (
        <ServiceSubcategoryView 
          categoryId={selectedCategory}
          onBack={handleBackToCategories}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleFilterChange("all")}
              >
                All Services
              </Button>
              <Button 
                variant={activeFilter === "home" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleFilterChange("home")}
              >
                Home & Repairs
              </Button>
              <Button 
                variant={activeFilter === "electronics" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleFilterChange("electronics")}
              >
                Electronics
              </Button>
              <Button 
                variant={activeFilter === "professional" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleFilterChange("professional")}
              >
                Professional
              </Button>
              <Button 
                variant={activeFilter === "personal" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleFilterChange("personal")}
              >
                Personal Care
              </Button>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Services</SheetTitle>
                  <SheetDescription>
                    Narrow down services by category, price, or availability
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <Tabs defaultValue="category" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="category">Category</TabsTrigger>
                      <TabsTrigger value="price">Price</TabsTrigger>
                      <TabsTrigger value="time">Time</TabsTrigger>
                    </TabsList>
                    <TabsContent value="category" className="space-y-4">
                      {/* Category filters would go here */}
                      <div className="space-y-2">
                        {serviceCategories.slice(0, 8).map(category => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={`filter-${category.id}`}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`filter-${category.id}`} className="text-sm">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="price">
                      {/* Price range filter would go here */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="price-all" name="price" className="h-4 w-4" />
                          <label htmlFor="price-all">All prices</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="price-under-500" name="price" className="h-4 w-4" />
                          <label htmlFor="price-under-500">Under ₹500</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="price-500-1000" name="price" className="h-4 w-4" />
                          <label htmlFor="price-500-1000">₹500 - ₹1000</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="price-above-1000" name="price" className="h-4 w-4" />
                          <label htmlFor="price-above-1000">Above ₹1000</label>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="time">
                      {/* Time availability filter would go here */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="time-morning" className="h-4 w-4" />
                          <label htmlFor="time-morning">Morning (8AM - 12PM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="time-afternoon" className="h-4 w-4" />
                          <label htmlFor="time-afternoon">Afternoon (12PM - 4PM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="time-evening" className="h-4 w-4" />
                          <label htmlFor="time-evening">Evening (4PM - 8PM)</label>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline">Reset</Button>
                  <Button>Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <PromoBanner />
          
          <ServiceCategories 
            searchQuery={searchQuery}
            onSelectCategory={handleCategorySelect}
            selectedCategory={null}
          />
          
          <PopularServices onSelectService={handlePopularServiceSelect} />
          
          {recentlyViewed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 p-6 rounded-lg border"
            >
              <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentlyViewed.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={() => {
                      const categoryId = item.id.split('-')[0];
                      setSelectedCategory(categoryId);
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
          
          <HowItWorks />
          <ServiceGuarantee />
        </>
      )}
    </motion.div>
  );
};

export default ServiceView;
