
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronLeft, IndianRupee, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isAfter, addDays, isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCreateServiceLead } from "@/hooks/useServiceLeads";

// Define the form schema with validation
const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  urgent: z.boolean().default(false),
});

type BookingFormValues = z.infer<typeof formSchema>;

interface ServiceBookingFormProps {
  categoryId: string;
  subserviceId: string;
  selectedSubserviceName: string;
  onBack: () => void;
  timeSlots: string[];
  estimatedAmount: number;
}

export default function ServiceBookingForm({
  categoryId,
  subserviceId,
  selectedSubserviceName,
  onBack,
  timeSlots,
  estimatedAmount
}: ServiceBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createLead, isCreating } = useCreateServiceLead();
  
  // Current date + 1 day as the minimum bookable date
  const minDate = addDays(new Date(), 1);
  // Current date + 30 days as the maximum bookable date
  const maxDate = addDays(new Date(), 30);
  
  // Initialize the form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      description: "",
      date: addDays(new Date(), 1), // Tomorrow by default
      urgent: false,
    },
  });

  // Form submission handler
  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to book a service.",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }
      
      // Format the data for submission
      const serviceLeadData = {
        user_id: session.user.id,
        customer_name: values.customerName,
        phone: values.phone,
        service_category: categoryId,
        service_type: selectedSubserviceName,
        description: values.description,
        address: values.address,
        appointment_date: format(values.date, 'yyyy-MM-dd'),
        appointment_time: values.timeSlot,
        urgent: values.urgent,
        amount: estimatedAmount
      };
      
      // Create service lead using the hook
      createLead(serviceLeadData, {
        onSuccess: () => {
          toast({
            title: "Service Booked Successfully",
            description: "Your service request has been submitted. You will be notified when a service provider accepts your request.",
          });
          navigate('/my-orders');
        },
        onError: (error) => {
          toast({
            title: "Booking Failed",
            description: error.message || "There was an error submitting your service request. Please try again.",
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error submitting your service request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <Button variant="outline" className="mb-4 flex w-fit items-center gap-1" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <CardTitle className="text-2xl">Book Your Service</CardTitle>
        <CardDescription>
          Complete the form below to book {selectedSubserviceName} service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your full address" {...field} />
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
                  <FormLabel>
                    Problem Description <span className="text-sm text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the issue you're experiencing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          onSelect={field.onChange}
                          disabled={(date) => 
                            isBefore(date, minDate) || 
                            isAfter(date, maxDate) || 
                            date.getDay() === 0 // Disable Sundays
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date within the next 30 days (excluding Sundays)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time Slot</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-2"
                      >
                        {timeSlots.map((slot) => (
                          <FormItem key={slot} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={slot} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {slot}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="urgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Urgent Service
                      {field.value && (
                        <Badge className="ml-2 bg-red-500">Priority</Badge>
                      )}
                    </FormLabel>
                    <FormDescription>
                      Request priority service (may incur additional charges)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Estimated Amount</h3>
                <div className="flex items-center gap-1 text-xl font-bold">
                  <IndianRupee className="h-5 w-5" />
                  {estimatedAmount}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Final price may vary based on the complexity of the service after inspection
              </p>
            </div>
            
            <CardFooter className="flex justify-end gap-2 px-0">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isCreating}
                className="gap-2"
              >
                {(isSubmitting || isCreating) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
