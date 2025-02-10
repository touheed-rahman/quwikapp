
import { Link } from "react-router-dom";

const ProfileHeader = () => {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Higoods
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default ProfileHeader;
