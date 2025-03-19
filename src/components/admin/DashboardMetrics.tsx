
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Users, ListChecks, Clock, Star, XCircle, BellRing, ArrowLeft, Wrench } from "lucide-react";
import MetricCard from "./MetricCard";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { Button } from "@/components/ui/button"; 

const DashboardMetrics = () => {
  const navigate = useNavigate();
  const { metrics, isLoading } = useAdminMetrics();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-full"></div>
          <div className="h-4 w-32 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Listings",
      value: metrics?.totalListings || 0,
      icon: ListChecks,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
      onClick: () => navigate('/admin', { state: { filter: 'all' } })
    },
    {
      title: "Pending Review",
      value: metrics?.pendingListings || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      hoverBgColor: "hover:bg-yellow-100",
      onClick: () => navigate('/admin', { state: { filter: 'pending' } })
    },
    {
      title: "Approved Listings",
      value: metrics?.approvedListings || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverBgColor: "hover:bg-green-100",
      onClick: () => navigate('/admin', { state: { filter: 'approved' } })
    },
    {
      title: "Featured Listings",
      value: metrics?.featuredListings || 0,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBgColor: "hover:bg-purple-100",
      onClick: () => navigate('/admin', { state: { filter: 'featured' } })
    },
    {
      title: "Service Now Leads",
      value: metrics?.serviceLeads || 0,
      icon: Wrench,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverBgColor: "hover:bg-teal-100",
      onClick: () => navigate('/admin', { state: { filter: 'service-leads' } })
    },
    {
      title: "Featured Requests",
      value: metrics?.featuredRequests || 0,
      icon: BellRing,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      hoverBgColor: "hover:bg-pink-100",
      onClick: () => navigate('/admin', { state: { filter: 'feature-requests' } })
    },
    {
      title: "Rejected Listings",
      value: metrics?.rejectedListings || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverBgColor: "hover:bg-red-100",
      onClick: () => navigate('/admin', { state: { filter: 'rejected' } })
    },
    {
      title: "Total Users",
      value: metrics?.totalUsers || 0,
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
