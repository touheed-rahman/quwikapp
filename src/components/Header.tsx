
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Bell,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  LogOut,
  Settings,
} from 'lucide-react';
import { CartButton } from './Header';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', data.user.id)
          .single();

        if (profileData?.avatar_url) {
          setAvatarUrl(profileData.avatar_url);
        }
      }
    };

    getUser();

    const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single();

        if (profileData?.avatar_url) {
          setAvatarUrl(profileData.avatar_url);
        }
      } else {
        setAvatarUrl(null);
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out of your account",
    });
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = user?.user_metadata?.full_name
    ? getInitials(user.user_metadata.full_name)
    : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-40 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl text-primary">
            Quwik
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          <Link to="/sell">
            <Button variant="default" className="bg-accent hover:bg-accent/90">
              Sell
            </Button>
          </Link>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white rounded-full text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </Link>

          <CartButton />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? (
                      <AvatarImage 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}`} 
                        alt="User avatar" 
                      />
                    ) : (
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-ads')}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>My Ads</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile?tab=settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              Sign in
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div className="py-6 flex flex-col space-y-2">
            {user ? (
              <div className="flex items-center p-4 bg-muted rounded-lg mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  {avatarUrl ? (
                    <AvatarImage 
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}`} 
                      alt="User avatar" 
                    />
                  ) : (
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <Button
                variant="default"
                className="w-full mb-4"
                onClick={() => {
                  navigate('/profile');
                  closeMenu();
                }}
              >
                Sign In
              </Button>
            )}

            <Button
              variant="accent"
              className="w-full bg-accent hover:bg-accent/90"
              onClick={() => {
                navigate('/sell');
                closeMenu();
              }}
            >
              Sell Now
            </Button>

            {user && (
              <>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate('/profile');
                    closeMenu();
                  }}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate('/my-ads');
                    closeMenu();
                  }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  My Ads
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate('/my-orders');
                    closeMenu();
                  }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  My Orders
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                navigate('/wishlist');
                closeMenu();
              }}
            >
              <Heart className="mr-2 h-5 w-5" />
              Wishlist
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                navigate('/notifications');
                closeMenu();
              }}
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {notificationCount > 0 && (
                <Badge className="ml-auto bg-primary">{notificationCount}</Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                navigate('/cart');
                closeMenu();
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart
            </Button>

            {user && (
              <Button
                variant="ghost"
                className="justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  handleSignOut();
                  closeMenu();
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign out
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
