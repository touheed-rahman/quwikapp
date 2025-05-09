
import { useState, useEffect } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/ui/theme-provider"
import { useTheme } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import Index from './pages/Index'
import CategorySubcategories from './pages/CategorySubcategories'
import Subcategory from './pages/Subcategory'
import Sell from './pages/Sell'
import Product from './pages/Product'
import Profile from './pages/Profile'
import MyAds from './pages/MyAds'
import Notifications from './pages/Notifications'
import Wishlist from './pages/Wishlist'
import ChatDetail from './pages/ChatDetail'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import SellerProfile from './pages/SellerProfile'
import FloatingSellButton from './components/navigation/FloatingSellButton'
import ScrollToTop from './components/utils/ScrollToTop'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { LocationProvider } from './contexts/LocationContext'
import { CartProvider } from './contexts/CartContext'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'

function App() {
  const [isMounted, setIsMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="preferred-theme">
        <LocationProvider>
          <CartProvider>
            <BrowserRouter>
              <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Toaster />
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/category/:categoryId" element={<CategorySubcategories />} />
                  <Route path="/category/:category/:subcategory" element={<Subcategory />} />
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-ads" element={<MyAds />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/chat/:id" element={<ChatDetail />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/seller/:id" element={<SellerProfile />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <FloatingSellButton />
              </ErrorBoundary>
            </BrowserRouter>
          </CartProvider>
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
