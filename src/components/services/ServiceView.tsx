
import { useState } from "react";
import { Grid, Wrench, Hammer, Zap, Smartphone, Monitor, Thermometer, Search, CalendarCheck, ThumbsUp, Clock, MapPin, AlertCircle } from "lucide-react";
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

const services = [
  { id: "appliance", name: "Appliance Repair", icon: Thermometer, color: "from-blue-500/10 to-blue-500/30", hoverColor: "hover:bg-blue-500/20" },
  { id: "electronic", name: "Electronics Repair", icon: Zap, color: "from-amber-500/10 to-amber-500/30", hoverColor: "hover:bg-amber-500/20" },
  { id: "mobile", name: "Mobile Repair", icon: Smartphone, color: "from-green-500/10 to-green-500/30", hoverColor: "hover:bg-green-500/20" },
  { id: "computer", name: "Computer Repair", icon: Monitor, color: "from-purple-500/10 to-purple-500/30", hoverColor: "hover:bg-purple-500/20" },
  { id: "plumbing", name: "Plumbing", icon: Wrench, color: "from-red-500/10 to-red-500/30", hoverColor: "hover:bg-red-500/20" },
  { id: "carpentry", name: "Carpentry", icon: Hammer, color: "from-orange-500/10 to-orange-500/30", hoverColor: "hover:bg-orange-500/20" },
];

const formSchema = z.object({
  service: z.string().min(1, { message: "Please select a service" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: "Please select a time slot" }),
  address: z.string().min(5, { message: "Please provide your address" }),
});

type FormValues = z.infer<typeof formSchema>;

const ServiceView = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      address: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Service Booked Successfully!",
      description: `Your ${selectedService} service has been scheduled for ${format(data.date, "PPP")} at ${data.time}.`,
    });
    setBookingStep(0);
    setSelectedService(null);
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

  const renderServiceSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => {
          const IconComponent = service.icon;
          const isSelected = selectedService === service.id;
          
          return (
            <motion.div 
              key={service.id} 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card 
                className={cn(
                  "h-full overflow-hidden border-2 cursor-pointer transition-all duration-300",
                  isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-transparent",
                )}
                onClick={() => {
                  setSelectedService(service.id);
                  form.setValue("service", service.id);
                  setTimeout(() => setBookingStep(1), 300);
                }}
              >
                <div className={`bg-gradient-to-br ${service.color} p-6 flex items-center justify-center`}>
                  <IconComponent className="h-12 w-12 text-primary" />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-lg">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">Professional service at your doorstep</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
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

      <Card className="border shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            {services.find(s => s.id === selectedService)?.icon({ className: "h-5 w-5 text-primary" })}
            Book {services.find(s => s.id === selectedService)?.name}
          </CardTitle>
          <CardDescription>
            Fill in the details below to schedule your service appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your issue</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What needs to be fixed?" 
                          className="resize-none min-h-[120px]" 
                          {...field}
                        />
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
                      <FormLabel>Preferred Time Slot</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={field.value === slot ? "default" : "outline"}
                            className={cn(
                              "justify-start h-auto py-3",
                              field.value === slot && "bg-primary text-white"
                            )}
                            onClick={() => field.onChange(slot)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
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
            className="pl-10 pr-4 h-12 w-full bg-primary/5 border-primary/20 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
      </motion.div>

      <motion.div variants={item} className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text inline-block mb-3">
          Professional Services at Your Doorstep
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Book reliable professionals for repairs and maintenance with just a few clicks
        </p>
      </motion.div>

      {bookingStep === 0 ? renderServiceSelection() : renderBookingForm()}

      {bookingStep === 0 && (
        <motion.div variants={item} className="bg-muted/50 p-6 rounded-lg mt-8">
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

      {bookingStep === 0 && (
        <motion.div variants={item} className="mt-8">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-none overflow-hidden">
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
