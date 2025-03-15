import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from '@/contexts/LocationContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import SellPage from './pages/SellPage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import ProductPage from './pages/ProductPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import UpdateListingPage from './pages/UpdateListingPage';
import ContactPage from './pages/ContactPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <CurrencyProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/category/:category/:subcategory" element={<SubcategoryPage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/update-listing/:productId" element={<UpdateListingPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Router>
          <Toaster />
        </CurrencyProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App;
