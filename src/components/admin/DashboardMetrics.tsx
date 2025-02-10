
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ListChecks, Clock, Star, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardMetrics = () => {
  const navigate = useNavigate();
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [
        totalListings, 
        pendingListings, 
        approvedListings, 
        totalUsers,
        featuredListings,
        rejectedListings
      ] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'rejected')
      ]);

      return {
        totalListings: totalListings.count || 0,
        pendingListings: pendingListings.count || 0,
        approvedListings: approvedListings.count || 0,
        totalUsers: totalUsers.count || 0,
        featuredListings: featuredListings.count || 0,
        rejectedListings: rejectedListings.count || 0
      };
    }
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        () => {
          console.log('Listings table changed, refetching metrics...');
          refetch();
        }
      )
      .subscribe();

    // Also subscribe to profiles changes for user count
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Profiles table changed, refetching metrics...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(profilesChannel);
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
