
import { useState } from "react";
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
  Tag
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

// Mock service lead data for demo
const serviceLeadsData = [
  {
    id: "SL-001",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    service: "Mobile Repair",
    subservice: "Screen Replacement",
    date: "2023-08-15",
    time: "10:00 AM - 12:00 PM",
    status: "Completed",
    amount: 799,
    urgent: false,
    icon: Smartphone,
    address: "123 ABC Colony, Sector 42, Gurgaon"
  },
  {
    id: "SL-002",
    customer: "Priya Patel",
    phone: "+91 87654 32109",
    service: "Appliance Service",
    subservice: "AC Repair",
    date: "2023-08-16",
    time: "02:00 PM - 04:00 PM",
    status: "Pending",
    amount: 1299,
    urgent: true,
    icon: WashingMachine,
    address: "456 XYZ Society, Andheri East, Mumbai"
  },
  {
    id: "SL-003",
    customer: "Vikram Singh",
    phone: "+91 76543 21098",
    service: "Home Services",
    subservice: "Plumbing Work",
    date: "2023-08-17",
    time: "09:00 AM - 11:00 AM",
    status: "In Progress",
    amount: 499,
    urgent: false,
    icon: Wrench,
    address: "789 PQR Apartments, Koramangala, Bangalore"
  },
  {
    id: "SL-004",
    customer: "Neha Gupta",
    phone: "+91 65432 10987",
    service: "TV Repair",
    subservice: "Display Issues",
    date: "2023-08-18",
    time: "04:00 PM - 06:00 PM",
    status: "Completed",
    amount: 1499,
    urgent: false,
    icon: Tv,
    address: "321 LMN Heights, Salt Lake, Kolkata"
  },
  {
    id: "SL-005",
    customer: "Arjun Reddy",
    phone: "+91 54321 09876",
    service: "Appliance Service",
    subservice: "Refrigerator Repair",
    date: "2023-08-19",
    time: "11:00 AM - 01:00 PM",
    status: "Cancelled",
    amount: 899,
    urgent: true,
    icon: WashingMachine,
    address: "654 RST Villas, Banjara Hills, Hyderabad"
  },
  {
    id: "SL-006",
    customer: "Sneha Desai",
    phone: "+91 43210 98765",
    service: "Mobile Repair",
    subservice: "Battery Replacement",
    date: "2023-08-20",
    time: "01:00 PM - 03:00 PM",
    status: "Pending",
    amount: 599,
    urgent: false,
    icon: Smartphone,
    address: "987 UVW Residency, Aundh, Pune"
  }
];

const ServiceLeadsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter leads based on search, status and service
  const filteredLeads = serviceLeadsData.filter(lead => {
    const matchesSearch = lead.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesService = serviceFilter === "all" || lead.service.toLowerCase() === serviceFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesService;
  });
  
  // Sort leads by date
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
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

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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
                <SelectItem value="mobile repair">Mobile Repair</SelectItem>
                <SelectItem value="appliance service">Appliance Service</SelectItem>
                <SelectItem value="home services">Home Services</SelectItem>
                <SelectItem value="tv repair">TV Repair</SelectItem>
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
                {sortedLeads.length > 0 ? (
                  sortedLeads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${selectedLead?.id === lead.id ? 'bg-primary/5' : ''}`}
                      onClick={() => handleLeadClick(lead)}
                    >
                      <TableCell className="font-medium">{lead.id}</TableCell>
                      <TableCell>{lead.customer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <lead.icon className="h-4 w-4 text-primary" />
                          </div>
                          {lead.service}
                          {lead.urgent && (
                            <Badge variant="outline" className="bg-red-50 text-red-600 text-xs border-red-200">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{new Date(lead.date).toLocaleDateString()}</span>
                          <span className="text-muted-foreground">{lead.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-right">₹{lead.amount}</TableCell>
                    </TableRow>
                  ))
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
                      <CardTitle>{selectedLead.customer}</CardTitle>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <selectedLead.icon className="h-6 w-6 text-primary" />
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
                        <p className="text-sm text-muted-foreground">{selectedLead.service} - {selectedLead.subservice}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
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
                          {new Date(selectedLead.date).toLocaleDateString()} • {selectedLead.time}
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
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${selectedLead.status === "In Progress" ? "bg-blue-50 text-blue-800 border-blue-200" : ""}`}
                      >
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        In Progress
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${selectedLead.status === "Completed" ? "bg-green-50 text-green-800 border-green-200" : ""}`}
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
