
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface AdminContentHeaderProps {
  activeTab: string;
}

export default function AdminContentHeader({ activeTab }: AdminContentHeaderProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'listings':
        return 'Listing Management';
      case 'users':
        return 'User Management';
      case 'analytics':
        return 'Analytics & Reports';
      case 'features':
        return 'Feature Management';
      default:
        return 'Dashboard';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview of your marketplace';
      case 'listings':
        return 'Manage and moderate listings';
      case 'users':
        return 'View and manage user accounts';
      case 'analytics':
        return 'View detailed marketplace statistics';
      case 'features':
        return 'Manage feature listings pricing and settings';
      default:
        return 'Overview of your marketplace';
    }
  };

  return (
    <div className="mb-6">
      <Heading title={getTabTitle()} description={getTabDescription()} />
      <Separator className="my-4" />
    </div>
  );
}
