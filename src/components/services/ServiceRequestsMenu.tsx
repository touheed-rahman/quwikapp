
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, ClipboardList, FileCheck, FileX, MapPin, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for service requests
const serviceRequests = [
  {
    id: "req-1",
    serviceType: "AC Service",
    dateRequested: "May 10, 2023",
    scheduledFor: "May 12, 2023, 10:00 AM",
    status: "completed",
    address: "123 Main St, Apartment 4B",
    technician: "Rahul Singh",
    amount: "₹499",
    rating: 5
  },
  {
    id: "req-2",
    serviceType: "Plumbing Repair",
    dateRequested: "May 15, 2023",
    scheduledFor: "May 16, 2023, 02:00 PM",
    status: "scheduled",
    address: "456 Park Avenue, House 7",
    technician: "Pending Assignment",
    amount: "₹349",
    rating: null
  },
  {
    id: "req-3",
    serviceType: "TV Installation",
    dateRequested: "May 8, 2023",
    scheduledFor: "May 9, 2023, 11:00 AM",
    status: "cancelled",
    address: "789 Lake View, Building C",
    technician: "N/A",
    amount: "₹0",
    rating: null
  }
];

const ServiceRequestsMenu = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "cancelled": return <FileX className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };
  
  const filteredRequests = activeTab === "all" 
    ? serviceRequests 
    : serviceRequests.filter(req => req.status === activeTab);

  return (
    <div className="mt-6 space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.serviceType}</CardTitle>
                      <Badge variant="outline" className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </Badge>
                    </div>
                    <CardDescription>Requested on {request.dateRequested}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">Scheduled for</div>
                          <div className="text-muted-foreground">{request.scheduledFor}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">Service Address</div>
                          <div className="text-muted-foreground">{request.address}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">Technician</div>
                          <div className="text-muted-foreground">{request.technician}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center pt-1">
                        <div className="font-medium">Amount</div>
                        <div className="font-bold text-lg">{request.amount}</div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-3">
                    {request.status === "scheduled" && (
                      <>
                        <Button variant="outline" size="sm" className="w-[48%]">Reschedule</Button>
                        <Button variant="destructive" size="sm" className="w-[48%]">Cancel</Button>
                      </>
                    )}
                    
                    {request.status === "completed" && !request.rating && (
                      <Button variant="outline" size="sm" className="w-full">Rate Service</Button>
                    )}
                    
                    {request.status === "completed" && request.rating && (
                      <div className="flex items-center gap-2 w-full justify-center text-yellow-500">
                        {Array(5).fill(0).map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-5 h-5"
                          >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                    )}
                    
                    {request.status === "cancelled" && (
                      <Button variant="outline" size="sm" className="w-full">Book Again</Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No requests found</h3>
              <p className="text-muted-foreground">You don't have any {activeTab !== 'all' ? activeTab + ' ' : ''}service requests yet.</p>
              <Button className="mt-4">Book a Service</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceRequestsMenu;
