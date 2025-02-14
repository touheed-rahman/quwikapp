
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Plus, User } from "lucide-react";
import MobileNavigation from "@/components/navigation/MobileNavigation";

interface Reel {
  id: string;
  video_url: string;
  user: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  description: string;
}

const Reels = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});

  // Example reels data - this would come from your backend
  const reels: Reel[] = [
    {
      id: "1",
      video_url: "https://example.com/video1.mp4",
      user: { name: "John Doe" },
      likes: 1200,
      comments: 45,
      description: "Check out this amazing product! #marketplace #shopping",
    },
    // Add more reels here
  ];

  const handleLike = (reelId: string) => {
    setLiked(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20">
        <div className="relative h-[calc(100vh-8rem)] bg-black">
          {/* Reel Video Container */}
          <div className="relative h-full w-full">
            {/* Video would go here */}
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Video Player
            </div>

            {/* Interaction Buttons */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => handleLike(reels[currentReel].id)}
              >
                <Heart 
                  className={liked[reels[currentReel].id] ? "fill-red-500 text-red-500" : "text-white"} 
                />
                <span className="text-xs mt-1">{reels[currentReel].likes}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <MessageCircle className="text-white" />
                <span className="text-xs mt-1">{reels[currentReel].comments}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <User className="text-white" />
                <span className="text-xs mt-1">Follow</span>
              </Button>
            </div>

            {/* User Info and Description */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-semibold">{reels[currentReel].user.name}</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="ml-2 text-xs"
                >
                  Follow
                </Button>
              </div>
              <p className="text-sm">{reels[currentReel].description}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Create Reel Button */}
      <Button 
        className="fixed bottom-20 right-4 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
        onClick={() => window.location.href = '/sell'}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <MobileNavigation />
    </div>
  );
};

export default Reels;
