
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInformation from "@/components/profile/ProfileInformation";
import ProfileSecuritySettings from "@/components/profile/ProfileSecuritySettings";
import ProfileNotifications from "@/components/profile/ProfileNotifications";

const Profile = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          location: profile.location,
          phone: profile.phone,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />

      <div className="container max-w-6xl mx-auto p-4 pt-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <ProfileSidebar profile={profile} handleLogout={handleLogout} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-9 space-y-6">
            {/* Profile Stats */}
            {session?.user?.id && <ProfileStats userId={session.user.id} />}

            {/* Profile Information */}
            <ProfileInformation
              profile={profile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setProfile={setProfile}
              handleUpdateProfile={handleUpdateProfile}
            />

            {/* Security Settings */}
            <ProfileSecuritySettings />

            {/* Notifications */}
            <ProfileNotifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
