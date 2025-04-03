import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/hooks/useAdminMetrics";
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

interface DashboardMetricsProps {
  metrics: Metric;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Listings"
        icon={<Tags className="h-4 w-4 text-blue-600" />}
        value={Number(metrics.activeListings || 0)}
        trend={metrics.listingTrend || 0}
        trendLabel={`${metrics.listingTrend > 0 ? '+' : ''}${metrics.listingTrend}% from last month`}
      />
      <MetricCard
        title="Total Users"
        icon={<Users className="h-4 w-4 text-purple-600" />}
        value={Number(metrics.totalUsers || 0)}
        trend={metrics.userTrend || 0}
        trendLabel={`${metrics.userTrend > 0 ? '+' : ''}${metrics.userTrend}% from last month`}
      />
      <MetricCard
        title="Completed Orders"
        icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        value={Number(metrics.completedOrders || 0)}
        trend={metrics.orderTrend || 0}
        trendLabel={`${metrics.orderTrend > 0 ? '+' : ''}${metrics.orderTrend}% from last month`}
      />
      <MetricCard
        title="Service Requests"
        icon={<Wrench className="h-4 w-4 text-amber-600" />}
        value={Number(metrics.serviceRequests || 0)}
        trend={metrics.serviceTrend || 0}
        trendLabel={`${metrics.serviceTrend > 0 ? '+' : ''}${metrics.serviceTrend}% from last month`}
      />
    </div>
  );
};

export default DashboardMetrics;
