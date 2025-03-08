
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotSignedInView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <p className="text-lg mb-4">Please sign in to view this chat</p>
      <Button onClick={() => navigate('/profile')}>Sign In</Button>
    </div>
  );
};

export default NotSignedInView;
