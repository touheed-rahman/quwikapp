
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Send } from "lucide-react";
import { useCreateServiceLead } from "@/hooks/useServiceLeads";
import { useSession } from "@/hooks/use-session-user";
import { useNavigate } from "react-router-dom";

interface ServiceConnectorProps {
  serviceId: string;
  serviceName: string;
}

const ServiceConnector = ({ serviceId, serviceName }: ServiceConnectorProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();
  const { createLead, isCreating } = useCreateServiceLead();
  const { session } = useSession();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and phone number",
        variant: "destructive"
      });
      return;
    }
    
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to request service information",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }
    
    // Create a quick service lead with minimal information
    const serviceLeadData = {
      user_id: session.user.id,
      customer_name: formData.name,
      phone: formData.phone,
      service_category: "inquiry", // Special category for quick inquiries
      service_type: serviceName,
      description: formData.message,
      address: "To be provided",
      appointment_date: new Date().toISOString().split('T')[0], // Today's date
      appointment_time: "To be scheduled",
      urgent: false,
      amount: 0
    };
    
    createLead(serviceLeadData, {
      onSuccess: () => {
        setFormData({
          name: '',
          phone: '',
          message: ''
        });
        
        toast({
          title: "Request Submitted",
          description: "We'll contact you shortly with more information about this service",
        });
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Service Request</CardTitle>
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
            <Label htmlFor="message">Your Message</Label>
            <Textarea 
              id="message"
              name="message"
              placeholder={`I'm interested in the ${serviceName} service...`}
              value={formData.message}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              type="submit" 
              className="flex-1 gap-2" 
              disabled={isCreating}
            >
              <Send className="h-4 w-4" />
              Request Information
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => window.location.href = `tel:+919876543210`}
            >
              <Phone className="h-4 w-4" />
              Call Us
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            By submitting this form, you agree to be contacted about our services
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceConnector;
