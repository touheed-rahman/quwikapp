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

interface ServiceBookingFormProps {
  categoryId: string;
  serviceName: string;
  price: number;
}

const ServiceBookingForm = ({ categoryId, serviceName, price }: ServiceBookingFormProps) => {
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      service_type: serviceName,
      description: formData.additionalInfo || '',
      address: formData.address,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      appointment_time: selectedTime,
      urgent: formData.urgent,
      amount: price,
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Book {serviceName}</CardTitle>
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
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Select Time</Label>
              <Select onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
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
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urgent"
              name="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, urgent: !!checked }))}
            />
            <Label htmlFor="urgent">Urgent Request</Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isCreating}
          >
            {isCreating ? "Submitting..." : `Book Service for ₹${price}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceBookingForm;
