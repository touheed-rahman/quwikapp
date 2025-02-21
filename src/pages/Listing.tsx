
import { useParams } from "react-router-dom";
import Header from "@/components/Header";

const Listing = () => {
  const { listingId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div>Listing ID: {listingId}</div>
      </main>
    </div>
  );
};

export default Listing;
