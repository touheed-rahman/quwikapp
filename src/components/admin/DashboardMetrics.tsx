
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ListChecks, Clock, Star, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface DashboardMetrics {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  totalUsers: number;
  featuredListings: number;
  rejectedListings: number;
}

const DashboardMetrics = () => {
  const navigate = useNavigate();
  
  const { data: metrics, isLoading, refetch } = useQuery<DashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_dashboard_metrics') as { 
          data: DashboardMetrics | null; 
          error: Error | null 
        };

      if (error) {
        console.error('Error fetching metrics:', error);
        return {
          totalListings: 0,
          pendingListings: 0,
          approvedListings: 0,
          totalUsers: 0,
          featuredListings: 0,
          rejectedListings: 0
        };
      }

      return data || {
        totalListings: 0,
        pendingListings: 0,
        approvedListings: 0,
        totalUsers: 0,
        featuredListings: 0,
        rejectedListings: 0
      };
    },
    staleTime: 1000, // Data considered fresh for 1 second
    gcTime: 3000, // Keep unused data for 3 seconds (replaces old cacheTime)
    refetchOnWindowFocus: false
  });

  // Optimize real-time subscriptions
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const debouncedRefetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        refetch();
      }, 300);
    };

    const channel = supabase
      .channel('dashboard-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        () => {
          console.log('Listings changed, triggering debounced refetch...');
          debouncedRefetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Profiles changed, triggering debounced refetch...');
          debouncedRefetch();
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timeoutId);
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  const cards = [
    {
      title: "Total Listings",
      value: metrics?.totalListings || 0,
      icon: ListChecks,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => navigate('/admin', { state: { filter: 'all' } })
    },
    {
      title: "Pending Review",
      value: metrics?.pendingListings || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      onClick: () => navigate('/admin', { state: { filter: 'pending' } })
    },
    {
      title: "Approved Listings",
      value: metrics?.approvedListings || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => navigate('/admin', { state: { filter: 'approved' } })
    },
    {
      title: "Featured Listings",
      value: metrics?.featuredListings || 0,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => navigate('/admin', { state: { filter: 'featured' } })
    },
    {
      title: "Rejected Listings",
      value: metrics?.rejectedListings || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      onClick: () => navigate('/admin', { state: { filter: 'rejected' } })
    },
    {
      title: "Total Users",
      value: metrics?.totalUsers || 0,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      onClick: () => navigate('/admin', { state: { filter: 'users' } })
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card 
          key={card.title} 
          className={`p-6 ${card.bgColor} border-none cursor-pointer transition-transform hover:scale-105`}
          onClick={card.onClick}
        >
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
