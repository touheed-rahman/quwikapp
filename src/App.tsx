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
import React from 'react';
import CategorySubcategories from "./pages/CategorySubcategories";
import SellerProfile from "./pages/SellerProfile";
import MyOrders from "./pages/MyOrders";
import ServiceDetail from "./pages/ServiceDetail";
import ServiceCenter from "./pages/ServiceCenter";
import ProviderAuth from "./services/ProviderAuth";

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

const ProviderRoute = ({ children }: { children: React.ReactNode }) => {
  const [isProvider, setIsProvider] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServiceProvider = async () => {
      try {
        const isServiceProvider = await ProviderAuth.isServiceProvider();
        setIsProvider(isServiceProvider);
      } catch (error) {
        console.error("Error checking service provider status:", error);
        setIsProvider(false);
      } finally {
        setLoading(false);
      }
    };

    checkServiceProvider();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isProvider) {
    return <Navigate to="/provider/login" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: isAdminResult, error } = await supabase
          .rpc('is_admin', { user_uid: user.id });

        if (error || !isAdminResult) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
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
              <Route path="/category/:categoryId" element={<CategorySubcategories />} />
              <Route path="/category/:category/:subcategory" element={<Subcategory />} />
              <Route path="/fresh-recommendations" element={<FreshRecommendations />} />
              <Route path="/recent-listings/:category" element={<RecentSubcategoryListings />} />
              <Route path="/seller/:id" element={<SellerProfile />} />
              <Route path="/services/:categoryId/:serviceId" element={<ServiceDetail />} />
              <Route path="/provider" element={<ServiceCenter />} />
              <Route
                path="/provider/dashboard"
                element={
                  <ProviderRoute>
                    <ServiceCenter />
                  </ProviderRoute>
                }
              />
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
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
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
                path="/my-orders"
                element={
                  <PrivateRoute>
                    <MyOrders />
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
