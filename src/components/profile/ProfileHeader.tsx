
import { Link } from "react-router-dom";

const ProfileHeader = () => {
  return (
    <header className="bg-primary/95 backdrop-blur-md border-b text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            Quwik
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default ProfileHeader;
