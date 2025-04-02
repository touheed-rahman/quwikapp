
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardMetrics as MetricsType, useAdminMetrics } from "@/hooks/useAdminMetrics";
import { ArrowUpDown, CheckSquare, Clock, ListFilter, ShoppingCart, Truck, Users2, Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MetricCard from "./MetricCard";

const triggerTabChange = (tabName: string) => {
  const event = new CustomEvent('adminTabChange', { detail: tabName });
  window.dispatchEvent(event);
};

const DashboardMetrics = () => {
  const navigate = useNavigate();
  const { metrics, isLoading } = useAdminMetrics();
  const { toast } = useToast();

  const formatNumber = (value: number | undefined) => {
    return value?.toLocaleString() || '0';
  };

  const handleCardClick = (filter: string) => {
    // Navigate to the same page but with state (this triggers a re-render with the filter applied)
    navigate("/admin", { state: { filter } });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Listings" 
          value={formatNumber(metrics?.totalListings)} 
          icon={ShoppingCart} 
          onClick={() => {
            triggerTabChange('listings');
            handleCardClick('listings');
          }}
          isLoading={isLoading}
          className="border-blue-100 bg-gradient-to-br from-blue-50 to-white"
          iconClassName="text-blue-500 bg-blue-100"
        />
        
        <MetricCard 
          title="Users" 
          value={formatNumber(metrics?.totalUsers)} 
          icon={Users2} 
          onClick={() => {
            triggerTabChange('users');
            handleCardClick('users');
          }}
          isLoading={isLoading}
          className="border-purple-100 bg-gradient-to-br from-purple-50 to-white"
          iconClassName="text-purple-500 bg-purple-100"
        />

        <MetricCard 
          title="Services Leads" 
          value={formatNumber(metrics?.serviceLeads)} 
          icon={Clock} 
          onClick={() => {
            triggerTabChange('service-leads');
            handleCardClick('service-leads');
          }}
          isLoading={isLoading}
          className="border-amber-100 bg-gradient-to-br from-amber-50 to-white"
          iconClassName="text-amber-500 bg-amber-100"
        />
        
        <MetricCard 
          title="Service Center" 
          value="Manage" 
          suffix="providers & services"
          icon={Wrench} 
          onClick={() => {
            triggerTabChange('service-center');
            handleCardClick('service-center');
          }}
          isLoading={isLoading}
          className="border-green-100 bg-gradient-to-br from-green-50 to-white"
          iconClassName="text-green-500 bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Listing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => {
                  triggerTabChange('listings');
                  handleCardClick('listings');
                }}
                variant="outline" 
                className="flex items-center gap-2 h-24 w-full border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:bg-blue-100/50 hover:text-blue-600"
              >
                <div className="flex flex-col items-center">
                  <ListFilter className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Pending</span>
                  <span className="text-xl font-bold">{formatNumber(metrics?.pendingListings)}</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => {
                  triggerTabChange('listings');
                  handleCardClick('listings');
                }}
                variant="outline" 
                className="flex items-center gap-2 h-24 w-full border-green-100 bg-gradient-to-br from-green-50 to-white hover:bg-green-100/50 hover:text-green-600"
              >
                <div className="flex flex-col items-center">
                  <CheckSquare className="h-5 w-5 mb-1 text-green-500" />
                  <span className="text-xs text-muted-foreground">Approved</span>
                  <span className="text-xl font-bold">{formatNumber(metrics?.approvedListings)}</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => {
                  triggerTabChange('listings');
                  handleCardClick('listings');
                }}
                variant="outline" 
                className="flex items-center gap-2 h-24 w-full border-amber-100 bg-gradient-to-br from-amber-50 to-white hover:bg-amber-100/50 hover:text-amber-600"
              >
                <div className="flex flex-col items-center">
                  <ArrowUpDown className="h-5 w-5 mb-1 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Featured</span>
                  <span className="text-xl font-bold">{formatNumber(metrics?.featuredListings)}</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Service Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                triggerTabChange('service-center');
                handleCardClick('service-center');
              }}
              variant="outline" 
              className="flex items-center gap-2 h-24 w-full border-green-100 bg-gradient-to-br from-green-50 to-white hover:bg-green-100/50 hover:text-green-600 mb-3"
            >
              <div className="flex flex-col items-center">
                <Wrench className="h-5 w-5 mb-1 text-green-500" />
                <span className="text-xs text-muted-foreground">Service Center</span>
                <span className="text-sm font-medium">Manage Providers</span>
              </div>
            </Button>
            
            <Button 
              onClick={() => {
                triggerTabChange('service-leads');
                handleCardClick('service-leads');
              }}
              variant="outline" 
              className="flex items-center gap-2 h-24 w-full border-amber-100 bg-gradient-to-br from-amber-50 to-white hover:bg-amber-100/50 hover:text-amber-600"
            >
              <div className="flex flex-col items-center">
                <Truck className="h-5 w-5 mb-1 text-amber-500" />
                <span className="text-xs text-muted-foreground">Service Leads</span>
                <span className="text-sm font-medium">Manage Requests</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;
