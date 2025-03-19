
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { formSchema, FormValues } from "@/types/serviceTypes";
import { serviceCategories } from "@/data/serviceCategories";
import { CalendarDays, Clock, IndianRupee, CheckCircle2, ArrowLeft } from "lucide-react";
import { useCreateServiceLead } from "@/hooks/useServiceLeads";

type ServiceBookingFormProps = {
  categoryId: string;
  subserviceId: string | null;
  selectedSubserviceName: string;
  onBack: () => void;
  timeSlots: string[];
  estimatedAmount: number;
};

const ServiceBookingForm = ({
  categoryId,
  subserviceId,
  selectedSubserviceName,
  onBack,
  timeSlots,
  estimatedAmount
}: ServiceBookingFormProps) => {
  const { toast } = useToast();
  
  // Get the category details
  const categoryDetails = serviceCategories.find(c => c.id === categoryId);
  
  // Use the createServiceLead hook
  const { createLead, isCreating } = useCreateServiceLead();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceCategory: categoryId || "",
      serviceType: selectedSubserviceName || "",
      description: "",
      date: undefined,
      time: "",
      address: "",
      name: "",
      phone: "",
      urgent: false,
    }
  });

  const onSubmit = (data: FormValues) => {
    // Get the category name
    const categoryName = categoryDetails?.name || "";
    
    // Prepare data for submission
    const leadData = {
      customer_name: data.name,
      phone: data.phone,
      service_category: categoryName,
      service_type: selectedSubserviceName,
      description: data.description,
      address: data.address,
      appointment_date: format(data.date, "yyyy-MM-dd"),
      appointment_time: data.time,
      status: "Pending",
      urgent: data.urgent,
      amount: estimatedAmount
    };
    
    // Create the service lead
    createLead(leadData, {
      onSuccess: () => {
        toast({
          title: "Service Booked Successfully!",
          description: `Your ${selectedSubserviceName} service has been scheduled for ${format(data.date, "PPP")} at ${data.time}.`,
          variant: "default",
        });
        
        // Reset form
        form.reset();
        onBack();
      },
      onError: (error) => {
        console.error("Error in service booking:", error);
        toast({
          title: "Booking Failed",
          description: "There was an error processing your request. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  return (
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
          className="text-muted-foreground flex items-center gap-1.5"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <div className="flex items-center gap-3">
                {categoryDetails && categoryDetails.icon({ 
                  className: "h-6 w-6 text-primary" 
                })}
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    Book {selectedSubserviceName}
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
                                className="resize-none min-h-[100px]" 
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
                                className="resize-none min-h-[100px]" 
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
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal flex justify-between items-center",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        "Pick a date"
                                      )}
                                      <CalendarDays className="h-4 w-4 opacity-50" />
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
                          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
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
                      disabled={isCreating}
                    >
                      {isCreating ? "Scheduling..." : "Schedule Service"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <ServiceSummaryCard 
            categoryDetails={categoryDetails}
            selectedSubserviceName={selectedSubserviceName}
            estimatedAmount={estimatedAmount}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Extract the service summary card into its own component
type ServiceSummaryCardProps = {
  categoryDetails: typeof serviceCategories[0] | undefined;
  selectedSubserviceName: string;
  estimatedAmount: number;
};

const ServiceSummaryCard = ({ 
  categoryDetails, 
  selectedSubserviceName, 
  estimatedAmount 
}: ServiceSummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border border-primary/10 shadow-md">
        <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="text-lg">Service Summary</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 pt-4 space-y-4">
          <div className="flex items-start gap-3 pb-3 border-b">
            <div className="bg-primary/10 p-2 rounded-full">
              {categoryDetails && categoryDetails.icon({ 
                className: "h-5 w-5 text-primary" 
              })}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{categoryDetails?.name}</p>
              <p className="text-primary font-semibold">{selectedSubserviceName}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Estimated Price</span>
              <div className="flex items-center text-lg font-bold text-primary">
                <IndianRupee className="h-4 w-4 mr-1" />
                {estimatedAmount}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Final price may vary based on service requirements
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">What's Included:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs">Professional service by certified experts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs">30-day service guarantee</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs">Quality spare parts (if required, charged separately)</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">NEW</Badge>
              <div className="text-xs text-green-800">
                Get 10% off on your first service booking! Applied at checkout.
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 flex flex-col items-start p-4">
          <p className="text-xs text-muted-foreground mb-2">Have questions about this service?</p>
          <Button variant="outline" size="sm" className="text-xs w-full">
            Contact Customer Support
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ServiceBookingForm;
