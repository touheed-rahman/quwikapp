
import { Loader2 } from "lucide-react";

const ChatLoadingView = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default ChatLoadingView;
