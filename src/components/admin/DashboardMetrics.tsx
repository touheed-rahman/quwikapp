
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Users, ListChecks, Clock, Star, XCircle, BellRing, ArrowLeft, Wrench } from "lucide-react";
import MetricCard from "./MetricCard";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { Button } from "@/components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton";

const DashboardMetrics = () => {
  const navigate = useNavigate();
  const { metrics, isLoading } = useAdminMetrics();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Ensure metrics is defined before accessing its properties
  const safeMetrics = metrics || {
    totalListings: 0,
    pendingListings: 0,
    approvedListings: 0,
    totalUsers: 0,
    featuredListings: 0,
    rejectedListings: 0,
    featuredRequests: 0,
    serviceLeads: 0
  };

  const metricCards = [
    {
      title: "Total Listings",
      value: safeMetrics.totalListings,
      icon: ListChecks,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
      onClick: () => navigate('/admin', { state: { filter: 'all' } })
    },
    {
      title: "Pending Review",
      value: safeMetrics.pendingListings,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      hoverBgColor: "hover:bg-yellow-100",
      onClick: () => navigate('/admin', { state: { filter: 'pending' } })
    },
    {
      title: "Approved Listings",
      value: safeMetrics.approvedListings,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverBgColor: "hover:bg-green-100",
      onClick: () => navigate('/admin', { state: { filter: 'approved' } })
    },
    {
      title: "Featured Listings",
      value: safeMetrics.featuredListings,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBgColor: "hover:bg-purple-100",
      onClick: () => navigate('/admin', { state: { filter: 'featured' } })
    },
    {
      title: "Service Now Leads",
      value: safeMetrics.serviceLeads,
      icon: Wrench,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverBgColor: "hover:bg-teal-100",
      onClick: () => navigate('/admin', { state: { filter: 'service-leads' } })
    },
    {
      title: "Featured Requests",
      value: safeMetrics.featuredRequests,
      icon: BellRing,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      hoverBgColor: "hover:bg-pink-100",
      onClick: () => navigate('/admin', { state: { filter: 'feature-requests' } })
    },
    {
      title: "Rejected Listings",
      value: safeMetrics.rejectedListings,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverBgColor: "hover:bg-red-100",
      onClick: () => navigate('/admin', { state: { filter: 'rejected' } })
    },
    {
      title: "Total Users",
      value: safeMetrics.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverBgColor: "hover:bg-indigo-100",
      onClick: () => navigate('/admin', { state: { filter: 'users' } })
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {metricCards.map((card, index) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          bgColor={card.bgColor}
          hoverBgColor={card.hoverBgColor}
          onClick={card.onClick}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default DashboardMetrics;
