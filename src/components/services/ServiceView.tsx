
import { useState } from "react";
import { Grid, Wrench, Hammer, Zap, Smartphone, Monitor, Thermometer, Search, CalendarCheck, ThumbsUp, Clock, MapPin, AlertCircle, Home, PaintBucket, Car, Utensils, Wifi, HeartPulse, BookOpen, Droplet, Scissors, Shirt, Bike } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import LocationSelector from "@/components/LocationSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Define main service categories
const serviceCategories = [
  { 
    id: "home", 
    name: "Home Services", 
    icon: Home, 
    color: "from-blue-500/10 to-blue-500/30", 
    hoverColor: "hover:bg-blue-500/20",
    subservices: [
      { id: "cleaning", name: "Home Cleaning" },
      { id: "plumbing", name: "Plumbing" },
      { id: "electrical", name: "Electrical Work" },
      { id: "painting", name: "Painting" },
      { id: "carpentry", name: "Carpentry" },
      { id: "pest_control", name: "Pest Control" }
    ]
  },
  { 
    id: "electronic", 
    name: "Electronics Repair", 
    icon: Zap, 
    color: "from-amber-500/10 to-amber-500/30", 
    hoverColor: "hover:bg-amber-500/20",
    subservices: [
      { id: "tv_repair", name: "TV Repair" },
      { id: "ac_service", name: "AC Repair & Service" },
      { id: "refrigerator", name: "Refrigerator Repair" },
      { id: "washing_machine", name: "Washing Machine Repair" },
      { id: "microwave", name: "Microwave Repair" }
    ]
  },
  { 
    id: "mobile", 
    name: "Mobile & Computer", 
    icon: Smartphone, 
    color: "from-green-500/10 to-green-500/30", 
    hoverColor: "hover:bg-green-500/20",
    subservices: [
      { id: "mobile_repair", name: "Mobile Repair" },
      { id: "computer_repair", name: "Computer Repair" },
      { id: "data_recovery", name: "Data Recovery" },
      { id: "screen_replacement", name: "Screen Replacement" },
      { id: "virus_removal", name: "Virus Removal" }
    ]
  },
  { 
    id: "car", 
    name: "Vehicle Services", 
    icon: Car, 
    color: "from-red-500/10 to-red-500/30", 
    hoverColor: "hover:bg-red-500/20",
    subservices: [
      { id: "car_repair", name: "Car Repair" },
      { id: "car_wash", name: "Car Wash & Detailing" },
      { id: "bike_service", name: "Bike Service" },
      { id: "oil_change", name: "Oil Change" },
      { id: "towing", name: "Towing Service" }
    ]
  },
  { 
    id: "salon", 
    name: "Beauty & Salon", 
    icon: Scissors, 
    color: "from-purple-500/10 to-purple-500/30", 
    hoverColor: "hover:bg-purple-500/20",
    subservices: [
      { id: "haircut", name: "Haircut & Styling" },
      { id: "makeup", name: "Makeup & Facials" },
      { id: "nails", name: "Nail Care" },
      { id: "spa", name: "Spa & Massage" },
      { id: "waxing", name: "Waxing" }
    ]
  },
  { 
    id: "health", 
    name: "Health & Fitness", 
    icon: HeartPulse, 
    color: "from-pink-500/10 to-pink-500/30", 
    hoverColor: "hover:bg-pink-500/20",
    subservices: [
      { id: "personal_training", name: "Personal Training" },
      { id: "yoga", name: "Yoga Classes" },
      { id: "nutrition", name: "Nutritionist Consultation" },
      { id: "physiotherapy", name: "Physiotherapy" },
      { id: "dietitian", name: "Dietitian Services" }
    ]
  },
  { 
    id: "education", 
    name: "Education & Tutoring", 
    icon: BookOpen, 
    color: "from-orange-500/10 to-orange-500/30", 
    hoverColor: "hover:bg-orange-500/20",
    subservices: [
      { id: "math_tutor", name: "Math Tutoring" },
      { id: "language", name: "Language Learning" },
      { id: "coding", name: "Coding Classes" },
      { id: "test_prep", name: "Test Preparation" },
      { id: "music_lessons", name: "Music Lessons" }
    ]
  },
  { 
    id: "cleaning", 
    name: "Cleaning Services", 
    icon: Droplet, 
    color: "from-cyan-500/10 to-cyan-500/30", 
    hoverColor: "hover:bg-cyan-500/20",
    subservices: [
      { id: "home_cleaning", name: "Home Deep Cleaning" },
      { id: "carpet_cleaning", name: "Carpet Cleaning" },
      { id: "laundry", name: "Laundry Services" },
      { id: "disinfection", name: "Sanitization & Disinfection" },
      { id: "office_cleaning", name: "Office Cleaning" }
    ]
  },
  { 
    id: "fashion", 
    name: "Fashion & Apparel", 
    icon: Shirt, 
    color: "from-indigo-500/10 to-indigo-500/30", 
    hoverColor: "hover:bg-indigo-500/20",
    subservices: [
      { id: "tailoring", name: "Tailoring & Alterations" },
      { id: "custom_design", name: "Custom Clothing Design" },
      { id: "shoe_repair", name: "Shoe Repair" },
      { id: "jewelry_repair", name: "Jewelry Repair" },
      { id: "costume_rental", name: "Costume Rental" }
    ]
  },
];

const formSchema = z.object({
  serviceCategory: z.string().min(1, { message: "Please select a service category" }),
  serviceType: z.string().min(1, { message: "Please select a specific service" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: "Please select a time slot" }),
  address: z.string().min(5, { message: "Please provide your address" }),
  name: z.string().min(2, { message: "Please provide your name" }),
  phone: z.string().min(10, { message: "Please provide a valid phone number" }),
  urgent: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

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
    });
    setBookingStep(0);
    setSelectedCategory(null);
    setSelectedSubservice(null);
    form.reset();
  };

  const timeSlots = [
    "09:00 AM - 11:00 AM", 
    "11:00 AM - 01:00 PM", 
    "01:00 PM - 03:00 PM", 
    "03:00 PM - 05:00 PM", 
    "05:00 PM - 07:00 PM"
  ];

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

  // Filter services based on search query
  const filteredServices = searchQuery 
    ? serviceCategories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subservices.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : serviceCategories;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
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

  const renderServiceSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {selectedCategory ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground flex items-center gap-1"
              onClick={() => setSelectedCategory(null)}
            >
              <span>←</span> Back to all services
            </Button>
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {serviceCategories.find(c => c.id === selectedCategory)?.name}
            </Badge>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Select a specific service</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {serviceCategories.find(c => c.id === selectedCategory)?.subservices.map((subservice) => (
              <motion.div 
                key={subservice.id} 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card 
                  className={cn(
                    "h-full overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/30",
                    selectedSubservice === subservice.id ? "border-primary shadow-md shadow-primary/10" : "border-border/50",
                  )}
                  onClick={() => handleSubserviceSelect(subservice.id, subservice.name)}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    <h3 className="font-medium text-lg mt-3">{subservice.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">Professional service at your doorstep</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.div 
                  key={category.id} 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Card 
                    className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-lg"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className={`bg-gradient-to-br ${category.color} p-6 flex items-center justify-center`}>
                      <IconComponent className="h-12 w-12 text-primary" />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">Professional service at your doorstep</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No services found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );

  const renderBookingForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground"
          onClick={() => setBookingStep(0)}
        >
          <span className="mr-1">←</span> Back to services
        </Button>
      </div>

      <Card className="border shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            {serviceCategories.find(c => c.id === selectedCategory)?.icon({ className: "h-6 w-6 text-primary" })}
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Book {serviceCategories.find(c => c.id === selectedCategory)?.subservices.find(s => s.id === selectedSubservice)?.name}
              </CardTitle>
              <CardDescription>
                Fill in the details below to schedule your service appointment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your complete address" 
                            className="resize-none min-h-[120px]" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your issue</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What needs to be fixed? Please provide details." 
                            className="resize-none min-h-[120px]" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Service Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    "Pick a date"
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="urgent"
                    render={({ field }) => (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="urgent-service"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-primary rounded focus:ring-primary"
                          />
                          <label htmlFor="urgent-service" className="text-sm font-medium text-amber-800">
                            This is an urgent request (priority service, additional charges may apply)
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                >
                  Schedule Service
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="flex flex-col md:flex-row gap-4 items-center" variants={item}>
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
            className="pl-10 pr-4 h-12 w-full border-primary/20 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
      </motion.div>

      <motion.div variants={item} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text inline-block mb-3">
          Professional Services at Your Doorstep
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Book reliable professionals for all your needs with just a few clicks
        </p>
      </motion.div>

      {bookingStep === 0 ? renderServiceSelection() : renderBookingForm()}

      {bookingStep === 0 && !selectedCategory && (
        <motion.div variants={item} className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-lg mt-8 border border-primary/5 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 relative">
                <Grid className="h-8 w-8 text-primary" />
                <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
              </div>
              <h3 className="font-semibold text-lg">Select Service</h3>
              <p className="text-muted-foreground">Choose from our range of professional services</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 relative">
                <CalendarCheck className="h-8 w-8 text-primary" />
                <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
              </div>
              <h3 className="font-semibold text-lg">Book Appointment</h3>
              <p className="text-muted-foreground">Schedule a convenient time for service</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 relative">
                <ThumbsUp className="h-8 w-8 text-primary" />
                <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
              </div>
              <h3 className="font-semibold text-lg">Get it Fixed</h3>
              <p className="text-muted-foreground">Our professionals will solve your problems</p>
            </div>
          </div>
        </motion.div>
      )}

      {bookingStep === 0 && !selectedCategory && (
        <motion.div variants={item} className="mt-8">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 overflow-hidden">
            <CardContent className="flex flex-col md:flex-row items-center p-6 gap-6">
              <div className="bg-primary/20 rounded-full p-4">
                <AlertCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Service Guarantee</h3>
                <p className="text-muted-foreground">All our service professionals are verified and provide a 30-day service warranty. You pay only after the service is completed to your satisfaction.</p>
              </div>
              <Button size="lg" className="shrink-0 mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceView;
