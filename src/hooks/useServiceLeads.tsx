
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceLead } from "@/types/serviceTypes";

const fetchServiceLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('service_leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching service leads:", error);
      throw new Error(error.message);
    }
    
    return data as ServiceLead[];
  } catch (error) {
    console.error("Error in fetchServiceLeads:", error);
    return [];
  }
};

const updateServiceLeadStatus = async ({ 
  leadId, 
  status 
}: { 
  leadId: string; 
  status: "Pending" | "In Progress" | "Completed" | "Cancelled" 
}) => {
  try {
    const { data, error } = await supabase
      .from('service_leads')
      .update({ status })
      .eq('id', leadId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating service lead status:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateServiceLeadStatus:", error);
    throw error;
  }
};

export function useServiceLeads() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['service-leads'],
    queryFn: fetchServiceLeads,
    refetchOnWindowFocus: false,
  });

  return {
    leads: data || [],
    isLoading,
    error,
  };
}

export function useUpdateServiceLeadStatus() {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: updateServiceLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });
  
  return {
    updateStatus: mutate,
    isUpdating: isPending,
  };
}
