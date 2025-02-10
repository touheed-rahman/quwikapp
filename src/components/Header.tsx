
import { MapPin, Bell, MessageSquare, User, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LocationSelector from "./LocationSelector";

const Header = () => {
  const [session, setSession] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="shrink-0">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Higoods
            </h1>
          </Link>
          <div className="hidden md:block">
            <LocationSelector 
              value={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Link to="/sell" className="hidden md:block">
                <Button className="hover:bg-primary hover:text-white">Sell Now</Button>
              </Link>
            </>
          ) : (
            <Link to="/profile">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
