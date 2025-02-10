
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ListChecks, Clock, Star, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardMetrics = () => {
  const navigate = useNavigate();
  
  // Optimize the query with staleTime and cacheTime
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      // Use a single query with count aggregation for better performance
      const { data: counts, error } = await supabase
        .rpc('get_dashboard_metrics');

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

      return counts || {
        totalListings: 0,
        pendingListings: 0,
        approvedListings: 0,
        totalUsers: 0,
        featuredListings: 0,
        rejectedListings: 0
      };
    },
    // Add caching configuration for better performance
    staleTime: 1000, // Consider data fresh for 1 second
    cacheTime: 3000, // Keep data in cache for 3 seconds
    refetchOnWindowFocus: false // Prevent unnecessary refetches
  });

  // Optimize real-time subscriptions
  useEffect(() => {
    // Batch updates using a debounced refetch
    let timeoutId: NodeJS.Timeout;
    const debouncedRefetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        refetch();
      }, 300); // Debounce updates by 300ms
    };

    // Use a single channel for both tables
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
