
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useCreateServiceLead } from "@/hooks/useServiceLeads";
import { useSession } from "@/hooks/use-session-user";
import { useNavigate } from "react-router-dom";
import { ServiceErrorBoundary } from '@/components/services/ServiceErrorBoundary';

export interface ServiceBookingFormProps {
  categoryId: string;
  serviceName: string;
  price: number;
  timeSlots?: string[];
  onBack?: () => void;
  estimatedAmount?: number;
  selectedSubserviceName?: string;
}

const ServiceBookingForm = ({ 
  categoryId, 
  serviceName, 
  price, 
  timeSlots = [], 
  onBack,
  estimatedAmount,
  selectedSubserviceName 
}: ServiceBookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    additionalInfo: '',
    urgent: false
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();
  const { createLead, isCreating } = useCreateServiceLead();
  const { session } = useSession();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      urgent: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to book a service",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.address || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create service lead data
    const serviceLeadData = {
      user_id: session.user.id,
      customer_name: formData.name,
      phone: formData.phone,
      service_category: categoryId,
      service_type: selectedSubserviceName || serviceName,
      description: formData.additionalInfo || '',
      address: formData.address,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      appointment_time: selectedTime,
      urgent: formData.urgent,
      amount: estimatedAmount || price,
      status: 'Pending' // Add required status field
    };
    
    // Submit service lead
    createLead(serviceLeadData, {
      onSuccess: () => {
        setFormData({
          name: '',
          phone: '',
          address: '',
          additionalInfo: '',
          urgent: false
        });
        
        setSelectedDate(undefined);
        setSelectedTime('');
        
        // Show success message and navigate to booking confirmation
        toast({
          title: "Service Booked Successfully",
          description: "You can track your service request in the My Services section",
        });
        
        navigate('/my-orders');
      }
    });
  };

  // Determine which time slots to display
  const displayTimeSlots = timeSlots.length > 0 ? timeSlots : [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ];
  
  return (
    <ServiceErrorBoundary>
      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Book {selectedSubserviceName || serviceName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-input/60 focus-visible:ring-primary/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210" 
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border-input/60 focus-visible:ring-primary/60"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                name="address"
                placeholder="123 Main St, City" 
                value={formData.address}
                onChange={handleChange}
                required
                className="border-input/60 focus-visible:ring-primary/60"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="border rounded-md p-2 bg-card">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full border-input/60 focus-visible:ring-primary/60">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {displayTimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-6 space-y-4">
                  <div className="bg-primary/5 p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Available Services</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Professional diagnosis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Quality repair with warranty</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Genuine replacement parts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Post-service assistance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea 
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Any specific details about the service needed..."
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={3}
                className="border-input/60 focus-visible:ring-primary/60"
              />
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/20">
              <Checkbox 
                id="urgent"
                checked={formData.urgent}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="urgent" className="text-sm">
                <span className="font-medium">Priority Service</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Get faster service with priority scheduling (additional charges may apply)
                </p>
              </Label>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-medium">₹{estimatedAmount || price}</span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isCreating}
              >
                {isCreating ? "Submitting..." : `Book Service for ₹${estimatedAmount || price}`}
              </Button>
              
              {onBack && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={onBack}
                >
                  Back to Service Details
                </Button>
              )}
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By booking, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </ServiceErrorBoundary>
  );
};

export default ServiceBookingForm;
