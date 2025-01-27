import { Search } from "lucide-react";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50 animate-fade-down">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Classifieds
          </h1>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Post Ad</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;