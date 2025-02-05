import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft } from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Higoods
            </h1>
          </Link>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <DashboardMetrics />
          <div>
            <h2 className="text-lg font-semibold mb-4">Listing Management</h2>
            <ListingManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;