
import { useState } from "react";
import { useServiceLeads, useUpdateServiceLeadStatus } from "@/hooks/useServiceLeads";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Phone, MapPin, Clock, IndianRupee, Search, User, Filter, XCircle } from "lucide-react";
import { ServiceLead } from "@/types/serviceTypes";
import { format } from "date-fns";

const ServiceLeadsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<ServiceLead | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ServiceLead;
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  const { leads, isLoading, error } = useServiceLeads();
  const { updateStatus, isUpdating } = useUpdateServiceLeadStatus();
  const { toast } = useToast();

  // Filter and sort leads
  const getFilteredLeads = () => {
    let filteredLeads = [...leads];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filteredLeads = filteredLeads.filter(lead => lead.status.toLowerCase() === statusFilter);
    }
    
    // Apply service filter
    if (serviceFilter !== "all") {
      filteredLeads = filteredLeads.filter(lead => 
        lead.service_category.toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredLeads = filteredLeads.filter(lead => 
        lead.customer_name.toLowerCase().includes(searchLower) ||
        lead.service_type.toLowerCase().includes(searchLower) ||
        lead.address.toLowerCase().includes(searchLower) ||
        lead.phone.includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (sortConfig) {
      filteredLeads.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by date (newest first)
      filteredLeads.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    
    return filteredLeads;
  };

  const handleSort = (key: keyof ServiceLead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get unique service categories for filter
  const getUniqueServiceCategories = () => {
    const categories = new Set(leads.map(lead => lead.service_category));
    return Array.from(categories);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "In Progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleUpdateStatus = (leadId: string, status: "Pending" | "In Progress" | "Completed" | "Cancelled") => {
    updateStatus(
      { leadId, status },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Lead status successfully changed to ${status}`,
          });
          // Close dialog if open
          if (selectedLead?.id === leadId) {
            setSelectedLead(null);
          }
        },
        onError: (error) => {
          toast({
            title: "Update failed",
            description: "There was an error updating the lead status",
            variant: "destructive",
          });
        },
      }
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setSortConfig(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Service Leads</h3>
        <p className="text-muted-foreground">There was a problem fetching the service leads data.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();
  const uniqueCategories = getUniqueServiceCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, service, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || statusFilter !== "all" || serviceFilter !== "all" || sortConfig) && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10">
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="py-4 px-6 bg-muted/30">
          <CardTitle className="text-lg font-medium">
            Service Leads {filteredLeads.length > 0 && `(${filteredLeads.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[180px] cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    Date
                    {sortConfig?.key === 'created_at' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('customer_name')}
                  >
                    Customer
                    {sortConfig?.key === 'customer_name' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('service_category')}
                  >
                    Service
                    {sortConfig?.key === 'service_category' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Appointment</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    Price
                    {sortConfig?.key === 'amount' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortConfig?.key === 'status' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <XCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No service leads found</p>
                        <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2">
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="group hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(lead.created_at), "PP")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{lead.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{lead.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{lead.service_category}</div>
                          <div className="text-sm text-muted-foreground">{lead.service_type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{lead.appointment_date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lead.appointment_time}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{lead.amount}</span>
                        </div>
                        {lead.urgent && (
                          <Badge className="bg-red-100 text-red-800 mt-1">Urgent</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedLead(lead)}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lead details dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Service Lead Details</DialogTitle>
                <DialogDescription>
                  Service request #{selectedLead.id.substring(0, 8)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedLead.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Service</h3>
                    <div className="font-medium">{selectedLead.service_category}</div>
                    <div className="text-primary">{selectedLead.service_type}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-sm bg-muted/30 p-3 rounded-md">{selectedLead.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{selectedLead.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Appointment</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.appointment_time}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <Select 
                      defaultValue={selectedLead.status}
                      onValueChange={(value) => handleUpdateStatus(
                        selectedLead.id, 
                        value as "Pending" | "In Progress" | "Completed" | "Cancelled"
                      )}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Estimated Amount</span>
                      <div className="flex items-center font-semibold text-lg">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {selectedLead.amount}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Final price may vary based on service requirements
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedLead.status === "Pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(selectedLead.id, "Cancelled")}
                      disabled={isUpdating}
                      className="w-full sm:w-auto"
                    >
                      Cancel Service
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedLead.id, "In Progress")}
                      disabled={isUpdating}
                      className="w-full sm:w-auto"
                    >
                      Start Service
                    </Button>
                  </>
                )}
                
                {selectedLead.status === "In Progress" && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedLead.id, "Completed")}
                    disabled={isUpdating}
                    className="w-full sm:w-auto"
                  >
                    Mark as Completed
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceLeadsManagement;
