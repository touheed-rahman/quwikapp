
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
      // Get the metrics from the view
      const { data: viewData, error: viewError } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .single();

      if (viewError) {
        console.error('Error fetching metrics from view:', viewError);
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
        .from('service_leads')
        .select('count', { count: 'exact', head: true });
      
      const serviceLeads = serviceLeadsError ? 0 : (serviceLeadsCount || 0);

      // Map the database column names to our interface property names
      return {
        totalListings: viewData?.total_listings || 0,
        pendingListings: viewData?.pending_listings || 0,
        approvedListings: viewData?.approved_listings || 0,
        totalUsers: viewData?.total_users || 0,
        featuredListings: viewData?.featured_listings || 0,
        rejectedListings: viewData?.rejected_listings || 0,
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_leads'
        },
        () => {
          console.log('Service leads changed, triggering debounced refetch...');
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
