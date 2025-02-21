import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "@/pages/Index";
import Categories from "@/pages/Categories";
import Subcategory from "@/pages/Subcategory";
import Sell from "@/pages/Sell";
import Listing from "@/pages/Listing";
import Messages from "@/pages/Messages";
import Category from "@/pages/Category";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/listing/:listingId" element={<Listing />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/category/:categoryId" element={<Category />} />
      <Route path="/category/:categoryId/:subcategoryId" element={<Subcategory />} />
    </Routes>
  );
};

export default App;
