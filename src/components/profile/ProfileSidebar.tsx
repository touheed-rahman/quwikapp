
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserRound, Edit, LogOut, ShoppingBag, Heart, ShieldCheck, Store } from "lucide-react";
import { useState } from "react";

interface ProfileSidebarProps {
  profile: any;
  handleLogout: () => Promise<void>;
}

const ProfileSidebar = ({ profile, handleLogout }: ProfileSidebarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      
      // Upload the file to Supabase Storage
      const fileName = `profile-${user.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Update profile with new avatar URL
      const avatarUrl = data.path;
      await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully"
      });
      
      // Force refresh
      navigate(0);
      
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to get profile picture URL from Supabase storage
  const getProfilePictureUrl = () => {
    if (profile?.avatar_url) {
      return supabase.storage.from('profiles').getPublicUrl(profile.avatar_url).data.publicUrl;
    }
    return null;
  };

  return (
    <Card className="p-6 space-y-6 border-primary/10 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors overflow-hidden">
            {getProfilePictureUrl() ? (
              <img 
                src={getProfilePictureUrl()} 
                alt={profile?.full_name || "Profile"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                  e.currentTarget.parentElement!.classList.add("bg-primary/10");
                  e.currentTarget.parentElement!.innerHTML += `<div class="w-12 h-12 text-primary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;
                }}
              />
            ) : (
              <UserRound className="w-12 h-12 text-primary" />
            )}
          </div>
          <label 
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 cursor-pointer rounded-full w-8 h-8 bg-primary hover:bg-primary/90 flex items-center justify-center"
          >
            <Edit className="h-4 w-4 text-white" />
            <input 
              type="file" 
              id="profile-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleProfilePictureUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        <h2 className="mt-4 font-semibold text-lg">{profile?.full_name}</h2>
        <p className="text-sm text-muted-foreground">{profile?.email}</p>
      </div>
      
      <div className="space-y-2">
        <Link to="/wishlist">
          <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 transition-colors text-foreground hover:text-foreground" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Saved Items
          </Button>
        </Link>
        
        <Link to="/seller-dashboard">
          <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 transition-colors text-foreground hover:text-foreground" size="sm">
            <Store className="h-4 w-4 mr-2" />
            Seller Dashboard
          </Button>
        </Link>
        
        <Link to="/my-orders">
          <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 transition-colors text-foreground hover:text-foreground" size="sm">
            <ShoppingBag className="h-4 w-4 mr-2" />
            My Orders
          </Button>
        </Link>
        
        {profile?.isAdmin && (
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 transition-colors text-foreground hover:text-foreground" size="sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </Link>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start pl-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" 
          size="sm" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
