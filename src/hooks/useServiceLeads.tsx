
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceLead } from "@/types/serviceTypes";
import { useToast } from "@/components/ui/use-toast";

const fetchServiceLeads = async (): Promise<ServiceLead[]> => {
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
    
    return data as ServiceLead;
  } catch (error) {
    console.error("Error in updateServiceLeadStatus:", error);
    throw error;
  }
};

const deleteServiceLead = async (leadId: string) => {
  try {
    const { error } = await supabase
      .from('service_leads')
      .delete()
      .eq('id', leadId);
    
    if (error) {
      console.error("Error deleting service lead:", error);
      throw new Error(error.message);
    }
    
    return { success: true, id: leadId };
  } catch (error) {
    console.error("Error in deleteServiceLead:", error);
    throw error;
  }
};

const createServiceLead = async (leadData: Omit<ServiceLead, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('service_leads')
      .insert([leadData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating service lead:", error);
      throw new Error(error.message);
    }
    
    return data as ServiceLead;
  } catch (error) {
    console.error("Error in createServiceLead:", error);
    throw error;
  }
};

export function useServiceLeads() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['service-leads'],
    queryFn: fetchServiceLeads,
    refetchOnWindowFocus: false,
  });

  return {
    leads: data || [],
    isLoading,
    error,
    refetch
  };
}

export function useUpdateServiceLeadStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: updateServiceLeadStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['service-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      toast({
        title: "Status Updated",
        description: `Service request status updated to ${data.status}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  return {
    updateStatus: mutate,
    isUpdating: isPending,
  };
}

export function useDeleteServiceLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: deleteServiceLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      toast({
        title: "Lead Deleted",
        description: "The service lead has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: `Failed to delete lead: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  return {
    deleteLead: mutate,
    isDeleting: isPending,
  };
}

export function useCreateServiceLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: createServiceLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      toast({
        title: "Service Request Created",
        description: "Your service request has been submitted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: `Failed to submit service request: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  return {
    createLead: mutate,
    isCreating: isPending,
  };
}
