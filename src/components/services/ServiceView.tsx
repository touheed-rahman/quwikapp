
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import LocationSelector from "@/components/LocationSelector";
import ServiceCategories from "@/components/services/ServiceCategories";
import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import HowItWorks from "@/components/services/HowItWorks";
import ServiceGuarantee from "@/components/services/ServiceGuarantee";
import PopularServices from "@/components/services/PopularServices";
import PromoBanner from "@/components/services/PromoBanner";
import { formSchema, FormValues } from "@/types/serviceTypes";
import { format } from "date-fns";

const timeSlots = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM", 
  "12:00 PM - 02:00 PM", 
  "02:00 PM - 04:00 PM", 
  "04:00 PM - 06:00 PM", 
  "06:00 PM - 08:00 PM"
];

const ServiceView = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubservice, setSelectedSubservice] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      address: "",
      name: "",
      phone: "",
      urgent: false,
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Service Booked Successfully!",
      description: `Your ${data.serviceType} service has been scheduled for ${format(data.date, "PPP")} at ${data.time}.`,
      variant: "default",
    });
    setBookingStep(0);
    setSelectedCategory(null);
    setSelectedSubservice(null);
    form.reset();
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
    form.setValue("serviceCategory", categoryId);
    
    // Reset subservice selection when changing category
    setSelectedSubservice(null);
    form.setValue("serviceType", "");
  };

  const handleSubserviceSelect = (subserviceId: string, subserviceName: string) => {
    setSelectedSubservice(subserviceId);
    form.setValue("serviceType", subserviceName);
    setTimeout(() => setBookingStep(1), 300);
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
              value={selectedLocation} 
              onChange={setSelectedLocation} 
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

      {bookingStep === 0 ? (
        <>
          {!selectedCategory && <PromoBanner />}
          
          <ServiceCategories 
            searchQuery={searchQuery}
            onSelectCategory={handleCategorySelect}
            onSelectSubservice={handleSubserviceSelect}
            selectedCategory={selectedCategory}
          />
          
          {!selectedCategory && <PopularServices />}
        </>
      ) : (
        <ServiceBookingForm
          form={form}
          selectedCategory={selectedCategory}
          selectedSubservice={selectedSubservice}
          onBack={() => setBookingStep(0)}
          onSubmit={onSubmit}
          timeSlots={timeSlots}
        />
      )}

      {bookingStep === 0 && !selectedCategory && (
        <>
          <HowItWorks />
          <ServiceGuarantee />
        </>
      )}
    </motion.div>
  );
};

export default ServiceView;
