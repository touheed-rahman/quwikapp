
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceCategories } from "@/data/serviceCategories";

type ServiceFilterBarProps = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

const ServiceFilterBar = ({ activeFilter, onFilterChange }: ServiceFilterBarProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant={activeFilter === "all" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onFilterChange("all")}
        >
          All Services
        </Button>
        <Button 
          variant={activeFilter === "home" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onFilterChange("home")}
        >
          Home & Repairs
        </Button>
        <Button 
          variant={activeFilter === "electronics" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onFilterChange("electronics")}
        >
          Electronics
        </Button>
        <Button 
          variant={activeFilter === "professional" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onFilterChange("professional")}
        >
          Professional
        </Button>
        <Button 
          variant={activeFilter === "personal" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onFilterChange("personal")}
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
  );
};

export default ServiceFilterBar;
