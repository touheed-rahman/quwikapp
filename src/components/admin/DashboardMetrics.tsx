import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ListChecks, Clock } from "lucide-react";

const DashboardMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [totalListings, pendingListings, approvedListings, totalUsers] = await Promise.all([
        supabase.from('listings').count(),
        supabase.from('listings').count().eq('status', 'pending'),
        supabase.from('listings').count().eq('status', 'approved'),
        supabase.from('profiles').count()
      ]);

      return {
        totalListings: totalListings.count || 0,
        pendingListings: pendingListings.count || 0,
        approvedListings: approvedListings.count || 0,
        totalUsers: totalUsers.count || 0
      };
    }
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  const cards = [
    {
      title: "Total Listings",
      value: metrics?.totalListings || 0,
      icon: ListChecks,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Review",
      value: metrics?.pendingListings || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Approved Listings",
      value: metrics?.approvedListings || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Users",
      value: metrics?.totalUsers || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={`p-6 ${card.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;