
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Bell, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ServiceCenterAuth from "@/services/ServiceCenterAuth";
import { useSession } from "@/hooks/use-session-user";

type ServiceConnectorProps = {
  serviceId: string;
  serviceName: string;
  showCard?: boolean;
};

const ServiceConnector = ({ serviceId, serviceName, showCard = true }: ServiceConnectorProps) => {
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSession();
  
  useEffect(() => {
    // Check if user is a service provider
    const checkServiceProvider = async () => {
      if (session) {
        try {
          const isProvider = await ServiceCenterAuth.isServiceProvider();
          setIsServiceProvider(isProvider);
        } catch (error) {
          console.error("Error checking service provider status:", error);
        }
      }
    };
    
    checkServiceProvider();
    
    // Fetch service requests only if not a service provider
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // In a real app, we'd filter by the specific service
        const { data, error } = await supabase
          .from('service_leads')
          .select('*')
          .eq('service_type', serviceName)
          .limit(2)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setServiceRequests(data || []);
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session && serviceName && !isServiceProvider) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [serviceName, session, isServiceProvider]);
  
  const handleViewAllRequests = () => {
    navigate('/service-center');
  };
  
  // If user is a service provider, don't show service requests to them
  if (isServiceProvider) return null;
  
  if (!showCard) {
    return (
      <Button 
        onClick={handleViewAllRequests} 
        className="w-full mt-4"
        variant="outline"
      >
        View All Service Requests <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Service Requests
          </CardTitle>
          <Badge variant="outline" className="bg-primary/5">
            {loading ? "Loading..." : `${serviceRequests.length} requests`}
          </Badge>
        </div>
        <CardDescription>
          Recent service requests for {serviceName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="text-center py-6">
            <Clock className="h-6 w-6 animate-spin mx-auto mb-2 text-primary/70" />
            <p className="text-muted-foreground">Loading service requests...</p>
          </div>
        ) : serviceRequests.length > 0 ? (
          serviceRequests.map((request) => (
            <div key={request.id} className="p-3 rounded-lg border hover:bg-muted/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{request.customer_name}</h4>
                <Badge
                  className={
                    request.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {request.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {request.description || "No description provided"}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(request.appointment_date).toLocaleDateString()}, {request.appointment_time}</span>
                </div>
                {request.urgent && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                    Urgent
                  </Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-muted/10 rounded-lg">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No pending service requests</p>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Button 
          onClick={handleViewAllRequests} 
          className="w-full"
          variant="outline"
        >
          Go to Service Center <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceConnector;
