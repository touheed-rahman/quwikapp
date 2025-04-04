
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type ServiceProviderRole = "service_provider" | "admin" | undefined;

/**
 * Service to handle authentication for service center
 */
const ServiceCenterAuth = {
  /**
   * Check if a user is authenticated as a service provider
   */
  async isServiceProvider(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) return false;
      
      // Get the user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
      
      if (!profile || error) return false;
      
      // Check if the user is a service provider and has been approved
      return (profile.role === 'service_provider' || profile.provider_type) && 
             (profile.provider_status === 'approved' || profile.provider_status === undefined);
    } catch (error) {
      console.error("Error checking if user is service provider:", error);
      return false;
    }
  },
  
  /**
   * Sign in as a service provider
   */
  async signInServiceProvider(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // After sign in, check if the user is a service provider
      if (data.user) {
        const isProvider = await this.isServiceProvider();
        if (!isProvider) {
          // Sign out if not a service provider
          await supabase.auth.signOut();
          throw new Error("This account does not have service provider access. If you've recently applied, please wait for approval.");
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
  
  /**
   * Register as a service provider
   */
  async registerServiceProvider(
    email: string, 
    password: string, 
    fullName: string,
    businessName: string,
    providerType: string,
    services: string,
    phone: string
  ) {
    try {
      // Check if the email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();
        
      if (existingUser) {
        throw new Error("An account with this email already exists. Please login or use a different email.");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            business_name: businessName,
            provider_type: providerType,
            services: services,
            phone: phone,
            role: 'service_provider',
            provider_status: 'pending' // Requires admin approval
          }
        }
      });
      
      if (error) throw error;
      
      // After registration, automatically sign out so they can't access the dashboard until approved
      await supabase.auth.signOut();
      
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
  
  /**
   * Sign out service provider
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },
  
  /**
   * Get the current provider's profile
   */
  async getProviderProfile() {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) return { profile: null, error: new Error("Not authenticated") };
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.session.user.id)
        .single();
        
      if (error) throw error;
      
      return { profile, error: null };
    } catch (error: any) {
      return { profile: null, error };
    }
  }
};

export default ServiceCenterAuth;
