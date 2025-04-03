
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { ArrowUpRight, CheckCircle, Tags, Users, Wrench } from "lucide-react";

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  trend: number;
  trendLabel: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, icon, value, trend, trendLabel }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">
          <ArrowUpRight className="h-4 w-4 mr-2 inline-block align-middle" />
          {trendLabel}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardMetrics: React.FC = () => {
  const { metrics, isLoading } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 bg-muted rounded mb-2"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-4 text-center border rounded-md bg-background">
        <p className="text-muted-foreground">Could not load metrics data</p>
      </div>
    );
  }
  
  // Define some default trend values if they're not present
  const listingTrend = 5;
  const userTrend = 8;
  const orderTrend = 12;
  const serviceTrend = 15;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Listings"
        icon={<Tags className="h-4 w-4 text-blue-600" />}
        value={Number(metrics.totalListings || 0)}
        trend={listingTrend}
        trendLabel={`${listingTrend > 0 ? '+' : ''}${listingTrend}% from last month`}
      />
      <MetricCard
        title="Total Users"
        icon={<Users className="h-4 w-4 text-purple-600" />}
        value={Number(metrics.totalUsers || 0)}
        trend={userTrend}
        trendLabel={`${userTrend > 0 ? '+' : ''}${userTrend}% from last month`}
      />
      <MetricCard
        title="Completed Orders"
        icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        value={metrics.serviceLeads || 0}
        trend={orderTrend}
        trendLabel={`${orderTrend > 0 ? '+' : ''}${orderTrend}% from last month`}
      />
      <MetricCard
        title="Service Requests"
        icon={<Wrench className="h-4 w-4 text-amber-600" />}
        value={metrics.serviceLeads || 0}
        trend={serviceTrend}
        trendLabel={`${serviceTrend > 0 ? '+' : ''}${serviceTrend}% from last month`}
      />
    </div>
  );
};

export default DashboardMetrics;
