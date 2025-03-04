
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "@/pages/Index";
import Category from "@/pages/CategoryGrid";
import Subcategory from "@/pages/Subcategory";
import Listing from "@/pages/Product";
import Profile from "@/pages/Profile";
import Sell from "@/pages/Sell";
import MyAds from "@/pages/MyAds";
import Wishlist from "@/pages/Wishlist";
import EditListing from "@/pages/Sell";
import Notifications from "@/pages/Notifications";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/category/:category/:subcategory" element={<Subcategory />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/edit-listing/:listingId" element={<EditListing />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
};

export default App;
