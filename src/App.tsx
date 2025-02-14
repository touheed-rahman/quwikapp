import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { LocationProvider } from "./contexts/LocationContext";
import ScrollToTop from "./components/utils/ScrollToTop";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import Index from "./pages/Index";
import Sell from "./pages/Sell";
import Product from "./pages/Product";
import Categories from "./pages/Categories";
import ChatDetail from "./pages/ChatDetail";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/Admin";
import MyAds from "./pages/MyAds";
import Wishlist from "./pages/Wishlist";
import Subcategory from "./pages/Subcategory";
import AdminLogin from "./pages/AdminLogin";
import FreshRecommendations from "./pages/FreshRecommendations";
import RecentSubcategoryListings from "./pages/RecentSubcategoryListings";
import Reels from "./pages/Reels";
import React from 'react';

// Create a client outside of the component to avoid recreating it on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        },
      },
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/profile" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocationProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/category/:category/:subcategory" element={<Subcategory />} />
              <Route path="/fresh-recommendations" element={<FreshRecommendations />} />
              <Route path="/recent-listings/:category" element={<RecentSubcategoryListings />} />
              <Route
                path="/sell"
                element={
                  <PrivateRoute>
                    <Sell />
                  </PrivateRoute>
                }
              />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/chat/:id"
                element={
                  <PrivateRoute>
                    <ChatDetail />
                  </PrivateRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-ads"
                element={
                  <PrivateRoute>
                    <MyAds />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </LocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
