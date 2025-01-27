import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const HeroSearch = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Find Anything You Need
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="pl-10 pr-4 h-12 text-lg w-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button size="lg" className="h-12 px-8 text-lg">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;