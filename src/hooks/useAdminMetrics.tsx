
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface DashboardMetrics {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  totalUsers: number;
  featuredListings: number;
  rejectedListings: number;
  featuredRequests: number;
  serviceLeads: number;
}

export function useAdminMetrics() {
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
          featuredRequests: 0,
          serviceLeads: 0
        };
      }

      // Fetch featuredRequests separately
      const { data: featuredRequestsData, error: featuredError } = await supabase
        .from('listings')
        .select('count')
        .eq('featured_requested', true)
        .single();

      const featuredRequests = featuredError ? 0 : (featuredRequestsData?.count || 0);
      
      // Fetch service leads count
      const { count: serviceLeadsCount, error: serviceLeadsError } = await supabase
        .rpc('count_service_leads');
      
      const serviceLeads = serviceLeadsError ? 0 : (serviceLeadsCount || 0);

      return {
        ...(data || {
          totalListings: 0,
          pendingListings: 0,
          approvedListings: 0,
          totalUsers: 0,
          featuredListings: 0,
          rejectedListings: 0
        }),
        featuredRequests,
        serviceLeads
      };
    },
    staleTime: 1000, // Data considered fresh for 1 second
    gcTime: 3000, // Keep unused data for 3 seconds
    refetchOnWindowFocus: false
  });

  // Optimize real-time subscriptions with debouncing
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

  return { metrics, isLoading };
}
