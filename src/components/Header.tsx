import { Search, MapPin, Bell, MessageSquare, Plus, User } from "lucide-react";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50 animate-fade-down">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="shrink-0">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Classifieds
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Select Location</span>
          </div>
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            <span>Sell</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;