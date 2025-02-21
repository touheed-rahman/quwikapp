
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/category/:categoryId/:subcategoryId" element={<Subcategory />} />
      </Routes>
    </Router>
  );
};

export default App;
