
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  WashingMachine, 
  Wrench, 
  Tv, 
  Filter, 
  Search, 
  Calendar, 
  Phone, 
  User, 
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
  CheckCircle,
  AlertCircle,
  Tag,
  MapPin
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ServiceLead {
  id: string;
  customer_name: string;
  phone: string;
  service_category: string;
  service_type: string;
  description: string;
  address: string;
  appointment_date: string;
  appointment_time: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  amount: number;
  urgent: boolean;
  created_at: string;
}

const getServiceIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "mobile repairs":
      return Smartphone;
    case "appliance service":
      return WashingMachine;
    case "home services":
      return Wrench;
    case "tv repair":
      return Tv;
    default:
      return Wrench;
  }
};

const ServiceLeadsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<ServiceLead | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [leads, setLeads] = useState<ServiceLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch service leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        // Query service leads table
        const { data, error } = await supabase
          .from('service_leads')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching service leads:", error);
          return;
        }
        
        setLeads(data as ServiceLead[]);
      } catch (err) {
        console.error("Failed to fetch service leads:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('service_leads_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_leads' 
      }, (payload) => {
        console.log('Change received!', payload);
        fetchLeads();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  // Update status of a service lead
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_leads')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating lead status:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update service status. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Status Updated",
        description: `Service lead status changed to ${newStatus}`,
      });
      
      // Update local state
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({
          ...selectedLead,
          status: newStatus as "Pending" | "In Progress" | "Completed" | "Cancelled"
        });
      }
      
      setLeads(leads.map(lead => 
        lead.id === id 
          ? { ...lead, status: newStatus as "Pending" | "In Progress" | "Completed" | "Cancelled" } 
          : lead
      ));
      
    } catch (err) {
      console.error("Failed to update lead status:", err);
    }
  };
  
  // Filter leads based on search, status and service
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesService = serviceFilter === "all" || lead.service_category.toLowerCase() === serviceFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesService;
  });
  
  // Sort leads by date
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
    } else {
      return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>;
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleLeadClick = (lead: ServiceLead) => {
    setSelectedLead(lead);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Get unique service categories for filtering
  const serviceCategories = Array.from(new Set(leads.map(lead => lead.service_category.toLowerCase())));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, customer name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {serviceCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSortToggle} className="flex items-center">
            {sortOrder === "asc" ? <ArrowUpAZ className="h-4 w-4 mr-2" /> : <ArrowDownAZ className="h-4 w-4 mr-2" />}
            Sort by Date
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Today's Bookings</DropdownMenuItem>
              <DropdownMenuItem>Urgent Requests</DropdownMenuItem>
              <DropdownMenuItem>High Value Bookings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading service leads...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedLeads.length > 0 ? (
                  sortedLeads.map((lead) => {
                    const IconComponent = getServiceIcon(lead.service_category);
                    return (
                      <TableRow 
                        key={lead.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${selectedLead?.id === lead.id ? 'bg-primary/5' : ''}`}
                        onClick={() => handleLeadClick(lead)}
                      >
                        <TableCell className="font-medium">{lead.id}</TableCell>
                        <TableCell>{lead.customer_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1 rounded">
                              <IconComponent className="h-4 w-4 text-primary" />
                            </div>
                            {lead.service_type}
                            {lead.urgent && (
                              <Badge variant="outline" className="bg-red-50 text-red-600 text-xs border-red-200">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>{new Date(lead.appointment_date).toLocaleDateString()}</span>
                            <span className="text-muted-foreground">{lead.appointment_time}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell className="text-right">₹{lead.amount}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No service leads found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div>
          {selectedLead ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2">{selectedLead.id}</Badge>
                      <CardTitle>{selectedLead.customer_name}</CardTitle>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getServiceIcon(selectedLead.service_category)({ className: "h-6 w-6 text-primary" })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone Number</p>
                        <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Service Details</p>
                        <p className="text-sm text-muted-foreground">{selectedLead.service_category} - {selectedLead.service_type}</p>
                        {selectedLead.description && (
                          <div className="mt-1 p-2 bg-muted/50 rounded text-xs">
                            {selectedLead.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Service Address</p>
                        <p className="text-sm text-muted-foreground">{selectedLead.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Appointment</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedLead.appointment_date).toLocaleDateString()} • {selectedLead.appointment_time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm font-semibold">₹{selectedLead.amount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Service Status</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${selectedLead.status === "Pending" ? "bg-yellow-50 text-yellow-800 border-yellow-200" : ""}`}
                        onClick={() => updateLeadStatus(selectedLead.id, "Pending")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${selectedLead.status === "In Progress" ? "bg-blue-50 text-blue-800 border-blue-200" : ""}`}
                        onClick={() => updateLeadStatus(selectedLead.id, "In Progress")}
                      >
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        In Progress
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${selectedLead.status === "Completed" ? "bg-green-50 text-green-800 border-green-200" : ""}`}
                        onClick={() => updateLeadStatus(selectedLead.id, "Completed")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full ${selectedLead.status === "Cancelled" ? "bg-red-50 text-red-800 border-red-200" : ""}`}
                        onClick={() => updateLeadStatus(selectedLead.id, "Cancelled")}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button className="w-full">Assign Professional</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-[440px] flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Service Lead Selected</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Select a service lead from the list to view details
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceLeadsManagement;
