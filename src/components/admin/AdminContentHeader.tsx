
import { Card } from "@/components/ui/card";

interface AdminContentHeaderProps {
  activeTab: string;
}

const AdminContentHeader = ({ activeTab }: AdminContentHeaderProps) => {
  return (
    <Card className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold">
        {activeTab === 'dashboard' && 'Dashboard Overview'}
        {activeTab === 'listings' && 'Manage Listings'}
        {activeTab === 'users' && 'User Management'}
        {activeTab === 'analytics' && 'Analytics & Reports'}
      </h1>
    </Card>
  );
};

export default AdminContentHeader;
