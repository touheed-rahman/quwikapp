
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceLead } from "@/components/admin/types";

interface UseServiceLeadsOptions {
  status?: string;
  providerId?: string;
}

export const useServiceLeads = (options: UseServiceLeadsOptions = {}) => {
  const { status, providerId } = options;
  
  return useQuery({
    queryKey: ['service-leads', status, providerId],
    queryFn: async () => {
      let query = supabase
        .from('service_leads')
        .select('*');
        
      if (status) {
        query = query.eq('status', status);
      }
      
      if (providerId) {
        query = query.eq('provider_id', providerId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching service leads:", error);
        throw error;
      }
      
      return data as ServiceLead[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
