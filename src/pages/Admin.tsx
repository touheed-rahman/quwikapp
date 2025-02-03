
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  ChevronLeft
} from "lucide-react";

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in a real app, this would come from your backend
  const listings = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      seller: "John Doe",
      price: "$899",
      status: "pending",
      date: "2024-02-20",
    },
    {
      id: 2,
      title: "MacBook Air M1",
      seller: "Jane Smith",
      price: "$999",
      status: "approved",
      date: "2024-02-19",
    },
    {
      id: 3,
      title: "Sony PS5",
      seller: "Mike Johnson",
      price: "$499",
      status: "rejected",
      date: "2024-02-18",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6 bg-green-50">
            <h3 className="font-medium text-green-700">Approved Listings</h3>
            <p className="text-2xl font-bold text-green-700">45</p>
          </Card>
          <Card className="p-6 bg-yellow-50">
            <h3 className="font-medium text-yellow-700">Pending Review</h3>
            <p className="text-2xl font-bold text-yellow-700">12</p>
          </Card>
          <Card className="p-6 bg-red-50">
            <h3 className="font-medium text-red-700">Rejected Listings</h3>
            <p className="text-2xl font-bold text-red-700">8</p>
          </Card>
          <Card className="p-6 bg-blue-50">
            <h3 className="font-medium text-blue-700">Total Users</h3>
            <p className="text-2xl font-bold text-blue-700">156</p>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Listings</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Title
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>{getStatusIcon(listing.status)}</TableCell>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell>{listing.seller}</TableCell>
                      <TableCell>{listing.price}</TableCell>
                      <TableCell>{listing.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-green-50 hover:bg-green-100 text-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 text-red-700"
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;

