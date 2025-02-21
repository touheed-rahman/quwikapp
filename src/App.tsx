
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "@/pages/Index";
import Categories from "@/pages/Categories";
import Subcategory from "@/pages/Subcategory";
import Sell from "@/pages/Sell";
import Category from "@/pages/Category";
import { LocationProvider } from "@/contexts/LocationContext";

const App = () => {
  return (
    <Router>
      <LocationProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/category/:categoryId/:subcategoryId" element={<Subcategory />} />
        </Routes>
      </LocationProvider>
    </Router>
  );
};

export default App;
