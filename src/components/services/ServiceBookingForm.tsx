
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Clock, Info, MapPin, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/use-session-user";
import { supabase } from "@/integrations/supabase/client";

// Define form schema with Zod
const formSchema = z.object({
  customer_name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(10, { message: "Please provide a detailed address" }),
  appointment_date: z.date({ required_error: "Please select a date" }),
  appointment_time: z.string({ required_error: "Please select a time slot" }),
  description: z.string().optional(),
  payment_method: z.enum(["cash", "online", "upi"], { required_error: "Please select a payment method" }),
  urgent: z.boolean().default(false),
});

type ServiceBookingFormProps = {
  categoryId: string | undefined;
  subserviceId: string | undefined;
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
  estimatedAmount,
}: ServiceBookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useSession();
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: user?.user_metadata?.full_name || "",
      phone: "",
      address: "",
      description: "",
      payment_method: "cash",
      urgent: false,
    },
  });

  // Calculate pricing
  const subtotal = estimatedAmount;
  const serviceFee = Math.round(subtotal * 0.05);
  const discount = user ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + serviceFee - discount;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (!session) {
        toast({
          title: "Login Required",
          description: "Please login to book a service",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      // Create a service lead
      const serviceData = {
        customer_name: data.customer_name,
        phone: data.phone,
        service_category: categoryId,
        service_type: selectedSubserviceName,
        description: data.description,
        address: data.address,
        appointment_date: format(data.appointment_date, "yyyy-MM-dd"),
        appointment_time: data.appointment_time,
        status: "Pending",
        urgent: data.urgent,
        user_id: session.user.id,
        amount: total,
        payment_method: data.payment_method,
      };
      
      const { data: createdLead, error } = await supabase
        .from("service_leads")
        .insert([serviceData])
        .select();
      
      if (error) throw error;
      
      // Success toast
      toast({
        title: "Booking Successful!",
        description: `Your ${selectedSubserviceName} service has been booked successfully.`,
      });
      
      // Navigate to service requests page or orders page
      navigate("/profile/orders");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Book Your Service</CardTitle>
            <CardDescription>
              Please provide your details to book the {selectedSubserviceName} service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                            <Input placeholder="Your contact number" {...field} />
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
                          <div className="relative">
                            <Textarea 
                              placeholder="Enter your complete address" 
                              className="min-h-[80px] resize-none pl-9" 
                              {...field} 
                            />
                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appointment_date"
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
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || date > addDays(new Date(), 30)
                                }
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
                      name="appointment_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pl-9"
                                value={field.value}
                                onChange={field.onChange}
                              >
                                <option value="" disabled>
                                  Select time slot
                                </option>
                                {timeSlots.map((slot) => (
                                  <option key={slot} value={slot}>
                                    {slot}
                                  </option>
                                ))}
                              </select>
                              <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Service Details <span className="text-muted-foreground">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your service requirement or any special instructions"
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="urgent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2">
                            <span>Urgent Service</span>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Priority</Badge>
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Select this if you need the service on priority basis
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="cash" id="cash" />
                              <Label htmlFor="cash" className="flex-1 cursor-pointer font-medium">Cash on Delivery</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="online" id="online" />
                              <Label htmlFor="online" className="flex-1 cursor-pointer font-medium">Credit/Debit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="upi" id="upi" />
                              <Label htmlFor="upi" className="flex-1 cursor-pointer font-medium">UPI / Mobile Wallet</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Payment will be collected after the service is completed to your satisfaction.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={onBack}>
                    Go Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="border-primary/10 shadow-sm sticky top-6">
          <CardHeader className="pb-2">
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Review your service details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Service:</span>
                <span className="font-medium">{selectedSubserviceName}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>₹{serviceFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-primary/5 p-3 space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Service Guarantee
              </h3>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5" />
                  <span>Verified Professional Service Providers</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5" />
                  <span>Hassle-free Rescheduling</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5" />
                  <span>100% Satisfaction or Money Back</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5" />
                  <span>30-day Service Warranty</span>
                </li>
              </ul>
            </div>
            
            {!session && (
              <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                <div className="flex flex-col items-start gap-2">
                  <h4 className="text-sm font-semibold">Login for Member Benefits</h4>
                  <p className="text-xs">Sign in to get 10% discount and track your service requests</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-1 bg-white border-blue-200 hover:bg-blue-50 text-blue-700"
                    onClick={() => navigate("/auth")}
                  >
                    Login / Sign Up
                  </Button>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceBookingForm;
