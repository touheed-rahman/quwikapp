
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from '@/contexts/LocationContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Sell from './pages/Sell';
import Categories from './pages/Categories';
import Subcategory from './pages/Subcategory';
import Product from './pages/Product';
import MyAds from './pages/MyAds';
import Profile from './pages/Profile';
import Help from './pages/Help';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <CurrencyProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<div>Authentication Page</div>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/category/:category" element={<Categories />} />
              <Route path="/category/:category/:subcategory" element={<Subcategory />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/update-listing/:productId" element={<MyAds />} />
              <Route path="/contact" element={<Help />} />
            </Routes>
          </Router>
          <Toaster />
        </CurrencyProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App;
