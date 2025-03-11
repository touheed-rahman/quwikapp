
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ListChecks, Clock, Star, XCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface DashboardMetrics {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  totalUsers: number;
  featuredListings: number;
  rejectedListings: number;
  verifiedSellers?: number;
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
          rejectedListings: 0,
          verifiedSellers: 0
        };
      }

      return data || {
        totalListings: 0,
        pendingListings: 0,
        approvedListings: 0,
        totalUsers: 0,
        featuredListings: 0,
        rejectedListings: 0,
        verifiedSellers: 0
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 bg-gray-50 animate-pulse h-32"></Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Listings",
      value: metrics?.totalListings || 0,
      icon: ListChecks,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
      onClick: () => navigate('/admin', { state: { filter: 'all' } })
    },
    {
      title: "Pending Review",
      value: metrics?.pendingListings || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      hoverBgColor: "hover:bg-yellow-100",
      onClick: () => navigate('/admin', { state: { filter: 'pending' } })
    },
    {
      title: "Approved Listings",
      value: metrics?.approvedListings || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverBgColor: "hover:bg-green-100",
      onClick: () => navigate('/admin', { state: { filter: 'approved' } })
    },
    {
      title: "Featured Listings",
      value: metrics?.featuredListings || 0,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBgColor: "hover:bg-purple-100",
      onClick: () => navigate('/admin', { state: { filter: 'featured' } })
    },
    {
      title: "Rejected Listings",
      value: metrics?.rejectedListings || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverBgColor: "hover:bg-red-100",
      onClick: () => navigate('/admin', { state: { filter: 'rejected' } })
    },
    {
      title: "Total Users",
      value: metrics?.totalUsers || 0,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverBgColor: "hover:bg-indigo-100",
      onClick: () => navigate('/admin', { state: { filter: 'users' } })
    },
    {
      title: "Verified Sellers",
      value: metrics?.verifiedSellers || 0,
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverBgColor: "hover:bg-teal-100",
      onClick: () => navigate('/admin', { state: { filter: 'verified' } })
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Card 
            className={`p-6 ${card.bgColor} border-none cursor-pointer transition-all duration-200 ${card.hoverBgColor} hover:shadow-md`}
            onClick={card.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <card.icon className={`h-8 w-8 ${card.color}`} />
                <div className={`text-xs font-medium flex items-center gap-1 ${card.color}`}>
                  <span>View</span>
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardMetrics;
