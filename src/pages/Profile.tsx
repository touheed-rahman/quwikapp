
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import {
  UserRound,
  Mail,
  MapPin,
  Edit,
  Settings,
  Shield,
  LogOut,
  BellRing,
  Share2,
  Lock,
  BookMarked,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";

const Profile = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch saved listings
  const { data: savedListings = [] } = useQuery({
    queryKey: ['saved-listings', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data: wishlistItems, error } = await supabase
        .from('wishlists')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;

      return wishlistItems
        .map(item => item.listings)
        .filter(Boolean);
    },
    enabled: !!session?.user?.id,
  });

  // Fetch shared listings (user's own listings)
  const { data: sharedListings = [] } = useQuery({
    queryKey: ['shared-listings', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

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

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://via.placeholder.com/300";
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
      <header className="bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Higoods
            </h1>
          </Link>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto p-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <Card className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="w-12 h-12 text-primary" />
                  </div>
                  <Button 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="mt-4 font-semibold text-lg">{profile?.full_name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <UserRound className="mr-2 h-4 w-4" />
                  Profile Settings
                </Button>
                <Link to="/notifications">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <BellRing className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Privacy
                </Button>
                <Link to="/wishlist">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Saved Items
                  </Button>
                </Link>
                {profile?.isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start text-red-600" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <UserRound className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profile?.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <Button 
                      onClick={handleUpdateProfile}
                      className="w-full"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">My Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedListings.map((listing: any) => (
                  <ProductCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location || "Location not specified"}
                    image={getFirstImageUrl(listing.images)}
                    condition={listing.condition}
                  />
                ))}
                {sharedListings.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    You haven't shared any listings yet
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Saved Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedListings.map((listing: any) => (
                  <ProductCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location || "Location not specified"}
                    image={getFirstImageUrl(listing.images)}
                    condition={listing.condition}
                  />
                ))}
                {savedListings.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No saved items yet
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
