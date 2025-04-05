
import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Check, X, ChevronDown, Search, Users, RefreshCw,
  Calendar, Phone, MapPin, CheckCircle, Clock, AlertTriangle
} from "lucide-react";
import { useServiceLeads } from "@/hooks/useServiceLeads";

type ServiceProvider = {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  provider_type: string;
  services: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  rating?: number;
  total_services?: number;
};

const ServiceCenterManagement = () => {
  const [activeTab, setActiveTab] = useState("providers");
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { leads } = useServiceLeads();
  
  useEffect(() => {
    fetchServiceProviders();
  }, []);
  
  const fetchServiceProviders = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the profiles table with a role filter
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('role.eq.service_provider,user_type.eq.service_provider');
        
      if (error) throw error;
      
      // Transform data to the expected format for this component
      const formattedProviders = data.map((provider: any) => ({
        id: provider.id,
        email: provider.email || '',
        full_name: provider.full_name || '',
        business_name: provider.business_name || provider.company_name || '',
        provider_type: provider.provider_type || 'individual',
        services: provider.services || '',
        phone: provider.phone || '',
        status: provider.status || 'pending',
        created_at: provider.created_at,
        rating: Math.floor(Math.random() * 5) + 3.5, // Mock rating
        total_services: Math.floor(Math.random() * 50) // Mock total services
      }));
      
      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching service providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service providers",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProviderStatus = async (providerId: string, status: "approved" | "rejected") => {
    try {
      // First update the local state for immediate feedback
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, status } 
            : provider
        )
      );
      
      // Create a custom column update
      const updateData: Record<string, any> = {};
      
      // For storing in the profiles table, we need to use a custom field
      // Since 'status' doesn't exist in the base type, we add it as a custom field
      updateData.provider_status = status;
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', providerId);
        
      if (error) throw error;
      
      toast({
        title: `Provider ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The service provider has been ${status} successfully.`
      });
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update provider status",
        variant: "destructive"
      });
      
      // Revert the local state change in case of error
      fetchServiceProviders();
    }
  };
  
  const assignLeadToProvider = async (leadId: string, providerId: string) => {
    try {
      // We need to update our service_leads table with a custom column
      // Since this field doesn't exist in the base type, we add it as a custom field
      const updateData: Record<string, any> = {
        provider_id: providerId,
        status: "In Progress" // Update the status to reflect assignment
      };
      
      const { error } = await supabase
        .from('service_leads')
        .update(updateData)
        .eq('id', leadId);
        
      if (error) throw error;
      
      toast({
        title: "Lead Assigned",
        description: "The service lead has been assigned successfully."
      });
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign the lead to provider",
        variant: "destructive"
      });
    }
  };
  
  const filteredProviders = providers.filter(provider => {
    const query = searchQuery.toLowerCase();
    return (
      provider.full_name.toLowerCase().includes(query) ||
      provider.business_name.toLowerCase().includes(query) ||
      provider.services.toLowerCase().includes(query) ||
      provider.email.toLowerCase().includes(query)
    );
  });
  
  const pendingLeads = leads.filter(lead => lead.status === "Pending");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg font-medium">Service Center Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage service providers and lead assignments
          </p>
        </div>
        <Button onClick={fetchServiceProviders} variant="outline" size="sm" className="gap-1 w-full sm:w-auto">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="providers">Service Providers</TabsTrigger>
          <TabsTrigger value="assignments">Lead Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="providers" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search providers..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Filter</Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProviders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 p-6">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No service providers found</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-4">
                {filteredProviders.map(provider => (
                  <Card key={provider.id} className="overflow-hidden">
                    <div className="bg-primary/5 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            provider.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            provider.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                            'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }
                        >
                          {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                        </Badge>
                        <span className="font-medium">{provider.full_name}</span>
                      </div>
                      
                      {provider.status === 'pending' && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                            onClick={() => updateProviderStatus(provider.id, 'rejected')}
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                            onClick={() => updateProviderStatus(provider.id, 'approved')}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Business Name</Label>
                          <p className="truncate">{provider.business_name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Provider Type</Label>
                          <p>{provider.provider_type}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Services Offered</Label>
                          <p className="line-clamp-2">{provider.services}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Contact</Label>
                          <p className="truncate">{provider.email}</p>
                          <p>{provider.phone}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Performance</Label>
                          <div className="flex justify-between items-center">
                            <span>Rating</span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              {provider.rating?.toFixed(1)} ⭐
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Total Services</span>
                            <Badge variant="outline">{provider.total_services}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Service Leads</CardTitle>
                <CardDescription>
                  Assign these leads to service providers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {pendingLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 p-6">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No pending leads</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {pendingLeads.map(lead => (
                        <div key={lead.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{lead.service_category} - {lead.service_type}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {lead.description || "No description provided"}
                              </p>
                            </div>
                            {lead.urgent && (
                              <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(lead.appointment_date || "").toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{lead.appointment_time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{lead.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{lead.address}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => {
                                // In a real app, you would show a provider selection dialog here
                                // For now, we'll just assign to the first available provider
                                const availableProvider = providers.find(p => p.status === 'approved');
                                if (availableProvider && lead.id) {
                                  assignLeadToProvider(lead.id, availableProvider.id);
                                } else {
                                  toast({
                                    title: "No Providers Available",
                                    description: "Please approve a service provider first",
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              Assign Provider
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Assignments</CardTitle>
                <CardDescription>
                  Track assigned service leads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.filter(lead => lead.status === "In Progress").slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-start gap-4 border-b pb-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">{lead.customer_name?.substring(0, 2).toUpperCase() || "CL"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium truncate">{lead.service_type}</h4>
                          <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(lead.appointment_date || "").toLocaleDateString()}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{lead.appointment_time}</span>
                        </div>
                        <div className="text-sm mt-1">
                          <span className="text-muted-foreground mr-1">Assigned to:</span>
                          <span className="font-medium">Provider #{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {leads.filter(lead => lead.status === "In Progress").length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No assigned leads</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Assignments</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceCenterManagement;
