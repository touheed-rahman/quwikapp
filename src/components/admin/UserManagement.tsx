
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, Loader2 } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  location: string | null;
  total_listings: number;
  is_verified: boolean;
  is_disabled: boolean;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: isAdmin } = await supabase.rpc('is_admin', { 
        user_uid: user.id 
      });

      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, created_at, updated_at, location, total_listings, is_verified, is_disabled');

      if (error) throw error;
      
      return (data || []).map(profile => ({
        ...profile,
        total_listings: profile.total_listings || 0,
        is_verified: profile.is_verified || false,
        is_disabled: profile.is_disabled || false
      })) as Profile[];
    }
  });

  const handleVerificationToggle = async (userId: string, currentState: boolean) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          is_verified: !currentState,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${currentState ? 'unverified' : 'verified'} successfully`,
      });
      refetch();
    } catch (error) {
      console.error('Error toggling verification:', error);
      toast({
        title: "Error",
        description: "Failed to update user verification status",
        variant: "destructive"
      });
    }
  };

  const handleStatusToggle = async (userId: string, currentState: boolean) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          is_disabled: !currentState,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${currentState ? 'enabled' : 'disabled'} successfully`,
      });
      refetch();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Total Listings</TableHead>
                <TableHead className="text-center">Verified</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">{user.total_listings}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user.is_verified}
                      onCheckedChange={() => handleVerificationToggle(user.id, user.is_verified)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={!user.is_disabled}
                      onCheckedChange={() => handleStatusToggle(user.id, user.is_disabled)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* View user details */}}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
