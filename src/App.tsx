import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "react-error-boundary";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import LocationProvider from "@/contexts/LocationContext";
import FeaturedListings from "./pages/FeaturedListings";
import Portfolio from "./pages/Portfolio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocationProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio/:userId" element={<Portfolio />} />
              <Route path="/category/:category/:subcategory" element={<Category />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/featured-listings" element={<FeaturedListings />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </LocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
