
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Clock, Info, MapPin, BadgeIndianRupee, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { formSchema, FormValues } from "@/types/serviceTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

type ServiceBookingFormProps = {
  subserviceId: string | null;
  categoryId: string;
  selectedSubserviceName: string;
  onBack: () => void;
  timeSlots: string[];
  estimatedAmount: number;
};

const ServiceBookingForm = ({
  subserviceId,
  categoryId,
  selectedSubserviceName,
  onBack,
  timeSlots,
  estimatedAmount
}: ServiceBookingFormProps) => {
  const { toast } = useToast();
  const { session } = useSession();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceCategory: categoryId || "",
      serviceType: subserviceId || "",
      description: "",
      date: date,
      time: "",
      address: "",
      name: session?.user?.user_metadata?.full_name || "",
      phone: "",
      urgent: false,
      service_type: "onsite",
      additional_notes: "",
    },
  });
  
  const serviceType = form.watch("service_type");

  const handleFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to book a service",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Calculate estimated time based on time slot
      const appointmentDate = format(values.date, "yyyy-MM-dd");
      
      const { data, error } = await supabase.from("service_leads").insert({
        customer_name: values.name,
        phone: values.phone,
        service_category: values.serviceCategory,
        service_type: values.serviceType,
        description: values.description,
        address: values.address,
        appointment_date: appointmentDate,
        appointment_time: values.time,
        status: "Pending",
        amount: estimatedAmount,
        urgent: values.urgent,
        user_id: session.user.id,
        service_delivery_type: values.service_type,
        additional_notes: values.additional_notes || "",
      }).select();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Service booked successfully!",
        description: `Your ${selectedSubserviceName} service has been booked for ${appointmentDate} at ${values.time}.`,
      });
      
      // Reset form and go back to service list
      form.reset();
      onBack();
      
    } catch (error: any) {
      toast({
        title: "Failed to book service",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-muted-foreground flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to services
          </Button>
          
          <h2 className="text-2xl font-bold mt-4">{selectedSubserviceName}</h2>
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {categoryId}
            </Badge>
            
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.8</span>
              <span>(120+ bookings)</span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>1-2 hours</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <BadgeIndianRupee className="h-4 w-4 text-green-500" />
              <span className="font-medium">₹{estimatedAmount}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-medium">Book Your Service</h3>
            </CardHeader>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <CardContent className="space-y-6 pt-6">
                  <Tabs defaultValue="service_details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="service_details">1. Service Details</TabsTrigger>
                      <TabsTrigger value="schedule">2. Schedule</TabsTrigger>
                      <TabsTrigger value="contact_info">3. Contact Info</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="service_details" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="service_type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Service Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="onsite" id="onsite" />
                                  <Label htmlFor="onsite" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Onsite Service (Expert visits your location)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="pickup" id="pickup" />
                                  <Label htmlFor="pickup" className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Pickup & Drop (We collect, repair, & deliver back)
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Describe your issue</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about the service you need..." 
                                className="min-h-[120px] resize-none" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="additional_notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Instructions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any special instructions for the service professional..." 
                                className="resize-none" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="schedule" className="space-y-4 mt-4">
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
                                    className="pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setDate(date);
                                  }}
                                  disabled={(date) => {
                                    // Disable past dates and limit future booking up to 30 days
                                    const now = new Date();
                                    now.setHours(0, 0, 0, 0);
                                    const maxDate = new Date();
                                    maxDate.setDate(maxDate.getDate() + 30);
                                    return date < now || date > maxDate;
                                  }}
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                              {timeSlots.map((slot) => (
                                <Button
                                  key={slot}
                                  type="button"
                                  variant={field.value === slot ? "default" : "outline"}
                                  className={`justify-center text-sm ${field.value === slot ? "bg-primary text-primary-foreground" : ""}`}
                                  onClick={() => field.onChange(slot)}
                                >
                                  {slot}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="urgent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Urgent Service</FormLabel>
                              <FormDescription>
                                Request priority service (additional ₹100 charge)
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="contact_info" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} type="tel" />
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
                            <FormLabel>{serviceType === "onsite" ? "Service Address" : "Pickup Address"}</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-6 pb-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onBack}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-1"
                  >
                    {isSubmitting ? "Submitting..." : "Book Service"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-2">
              <h3 className="font-medium">Service Summary</h3>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedSubserviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{categoryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{date ? format(date, "PPP") : "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Type</span>
                  <Badge variant="outline">{serviceType === "onsite" ? "Onsite" : "Pickup & Drop"}</Badge>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground">Service Charge</span>
                  <span className="font-medium">₹{estimatedAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Priority Fee</span>
                  <span>{form.watch("urgent") ? "₹100" : "₹0"}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground font-medium">Total Amount</span>
                  <span className="font-bold text-lg text-primary">
                    ₹{form.watch("urgent") ? estimatedAmount + 100 : estimatedAmount}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg bg-primary/5 p-3 text-sm">
                <p className="flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  Payment to be made after service completion. Our professionals carry portable payment machines.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceBookingForm;
