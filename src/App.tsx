
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Categories from "@/pages/Categories";
import Subcategory from "@/pages/Subcategory";
import Sell from "@/pages/Sell";
import Category from "@/pages/Category";
import { LocationProvider } from "@/contexts/LocationContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
