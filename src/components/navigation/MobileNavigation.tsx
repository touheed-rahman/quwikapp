
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, PlusCircle, Heart, UserCircle, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  onChatOpen?: () => void;
}

const MobileNavigation = ({ onChatOpen }: MobileNavigationProps) => {
  const iconClasses = "h-6 w-6";
  const activeClasses = "text-primary";
  const inactiveClasses = "text-muted-foreground";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              cn("flex flex-col items-center gap-1", 
                isActive ? activeClasses : inactiveClasses
              )
            }
          >
            <Home className={iconClasses} />
            <span className="text-xs">Home</span>
          </NavLink>

          <NavLink 
            to="/reels" 
            className={({ isActive }) => 
              cn("flex flex-col items-center gap-1", 
                isActive ? activeClasses : inactiveClasses
              )
            }
          >
            <Clapperboard className={iconClasses} />
            <span className="text-xs">Reels</span>
          </NavLink>

          <NavLink 
            to="/sell" 
            className={({ isActive }) => 
              cn("flex flex-col items-center gap-1", 
                isActive ? activeClasses : inactiveClasses
              )
            }
          >
            <PlusCircle className={iconClasses} />
            <span className="text-xs">Sell</span>
          </NavLink>

          <button 
            onClick={onChatOpen}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <MessageCircle className={iconClasses} />
            <span className="text-xs">Chat</span>
          </button>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              cn("flex flex-col items-center gap-1", 
                isActive ? activeClasses : inactiveClasses
              )
            }
          >
            <UserCircle className={iconClasses} />
            <span className="text-xs">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;
