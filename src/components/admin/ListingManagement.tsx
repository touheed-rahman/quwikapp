
import { useLocation } from "react-router-dom";
import ListingSearchBar from "./ListingSearchBar";
import ListingTable from "./ListingTable";
import ListingTabs from "./ListingTabs";
import ListingLoader from "./ListingLoader";
import ListingError from "./ListingError";
import ListingEmpty from "./ListingEmpty";
import { useAdminListings } from "@/hooks/useAdminListings";

const ListingManagement = () => {
  const location = useLocation();
  const filter = location.state?.filter || 'all';
  const {
    filteredListings,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    handleStatusUpdate,
    handleFeaturedToggle,
    handleDelete
  } = useAdminListings(filter);

  if (error) {
    return <ListingError />;
  }

  return (
    <div className="space-y-4">
      <ListingTabs currentFilter={filter} />
      
      <div className="flex items-center gap-4">
        <ListingSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {isLoading ? (
        <ListingLoader />
      ) : filteredListings?.length === 0 ? (
        <ListingEmpty />
      ) : (
        <ListingTable 
          listings={filteredListings || []}
          onStatusUpdate={handleStatusUpdate}
          onFeaturedToggle={handleFeaturedToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ListingManagement;
