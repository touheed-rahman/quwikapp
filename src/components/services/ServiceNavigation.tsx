
import { Home, Wrench, Calendar, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, href, active }: NavItemProps) => (
  <Link to={href} className="w-full">
    <div 
      className={cn(
        "flex flex-col items-center justify-center rounded-lg p-3 transition-all",
        active ? "bg-primary/10 text-primary" : "hover:bg-muted/80"
      )}
    >
      <Icon className={cn("h-5 w-5 mb-1", active ? "text-primary" : "text-muted-foreground")} />
      <span className={cn("text-xs font-medium", active ? "text-primary" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  </Link>
);

const ServiceNavigation = () => {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md border border-primary/5 p-3 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-5 gap-1">
        <NavItem icon={Home} label="Home" href="/" active />
        <NavItem icon={Wrench} label="Services" href="/services" />
        <NavItem icon={Calendar} label="My Bookings" href="/my-bookings" />
        <NavItem icon={User} label="Profile" href="/profile" />
        <NavItem icon={Settings} label="Settings" href="/settings" />
      </div>
    </motion.div>
  );
};

export default ServiceNavigation;
