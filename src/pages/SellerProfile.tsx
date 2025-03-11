
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import SeoHead from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import SellerProfileHeader from "@/components/seller/SellerProfileHeader";
import SellerListings from "@/components/seller/SellerListings";

const SellerProfile = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { profile, listings, isFollowing, currentUserId, handleFollow } = useSellerProfile(id);

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title={`${profile.full_name}'s Profile | Quwik Marketplace`}
        description={`Check out ${profile.full_name}'s listings and profile on Quwik. Member since ${new Date(profile.created_at).getFullYear()}`}
        noindex={true} // Add noindex directive for seller profiles
      />
      
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        <SellerProfileHeader
          profile={profile}
          isFollowing={isFollowing}
          currentUserId={currentUserId}
          profileId={id!}
          handleFollow={handleFollow}
          isMobile={isMobile}
        />
        
        <div className="mt-8">
          <SellerListings listings={listings} />
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;
