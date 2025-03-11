import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, MessageSquare } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";

const ProfileDropdown = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/profile');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/my-ads')}>My Ads</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/my-orders')}>My Orders</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const onChatOpen = () => {
    setIsChatOpen(true);
  };

  const handleCloseChatWindow = () => {
    setIsChatOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b z-40">
      <div className="container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary">BuySell</h1>
          </Link>
          
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/categories" className="text-sm font-medium hover:text-primary hidden sm:flex">
            Categories
          </Link>
          
          <Button
            variant="ghost"
            className="rounded-full hover:bg-gray-100 p-2"
            onClick={onChatOpen} // Ensure this is properly defined in your component
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <ProfileDropdown />
          
          <Suspense fallback={null}>
            <ChatWindow isOpen={isChatOpen} onClose={handleCloseChatWindow} />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
