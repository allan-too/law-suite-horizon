
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Contracts: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items for the sidebar
  const sidebarItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    { 
      title: 'Clients', 
      icon: Users, 
      href: '/dashboard/clients',
      active: location.pathname === '/dashboard/clients',
    },
    { 
      title: 'Intake Forms', 
      icon: FileText, 
      href: '/dashboard/intake-forms',
      active: location.pathname === '/dashboard/intake-forms',
    },
    { 
      title: 'Documents', 
      icon: FileText, 
      href: '/dashboard/documents',
      active: location.pathname === '/dashboard/documents',
    },
    { 
      title: 'Contracts', 
      icon: FileText, 
      href: '/dashboard/contracts',
      active: location.pathname === '/dashboard/contracts',
    },
    { 
      title: 'Billing', 
      icon: CreditCard, 
      href: '/dashboard/billing',
      active: location.pathname === '/dashboard/billing',
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      href: '/dashboard/settings',
      active: location.pathname === '/dashboard/settings',
    },
  ];

  // Mock contracts data
  const mockContracts = [
    { 
      id: 1, 
      name: 'Service Agreement - Smith', 
      client: 'John Smith',
      status: 'good', 
      lastUpdated: '2023-05-12',
      issues: 0,
      warnings: 0,
      value: '$5,000',
      dueDate: '2023-06-30',
    },
    { 
      id: 2, 
      name: 'Retainer - Johnson LLC', 
      client: 'Lisa Johnson',
      status: 'warning', 
      lastUpdated: '2023-05-10',
      issues: 0,
      warnings: 2,
      value: '$10,000',
      dueDate: '2023-06-15',
    },
    { 
      id: 3, 
      name: 'NDA - Tech Solutions', 
      client: 'Tech Solutions Inc.',
      status: 'danger', 
      lastUpdated: '2023-05-05',
      issues: 3,
      warnings: 1,
      value: 'N/A',
      dueDate: '2023-05-30',
    },
    { 
      id: 4, 
      name: 'Property Sale Agreement', 
      client: 'Michael Brown',
      status: 'good', 
      lastUpdated: '2023-05-02',
      issues: 0,
      warnings: 0,
      value: '$350,000',
      dueDate: '2023-07-15',
    },
    { 
      id: 5, 
      name: 'Partnership Terms - Williams Co', 
      client: 'Sarah Williams',
      status: 'warning', 
      lastUpdated: '2023-04-28',
      issues: 0,
      warnings: 1,
      value: '$25,000',
      dueDate: '2023-06-01',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            Good to sign
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
            Needs attention
          </Badge>
        );
      case 'danger':
        return <Badge variant="destructive">Red flag</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Contract Management"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Contracts</h2>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your legal contracts
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/contracts/new')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            New Contract
          </button>
        </div>

        <div className="grid gap-4 grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Contract Health Status</CardTitle>
              <CardDescription>Overview of all your contracts and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Value</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">Last Updated</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockContracts.map((contract) => (
                      <tr key={contract.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{contract.name}</td>
                        <td className="px-4 py-3">{contract.client}</td>
                        <td className="px-4 py-3">{contract.value}</td>
                        <td className="px-4 py-3">{new Date(contract.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{new Date(contract.lastUpdated).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(contract.status)}
                            {getStatusBadge(contract.status)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => navigate(`/dashboard/contracts/${contract.id}`)}
                            className="text-sm text-primary hover:underline mr-3"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => navigate(`/dashboard/contracts/${contract.id}/edit`)}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Good to Sign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockContracts.filter(c => c.status === 'good').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  No issues detected
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockContracts.filter(c => c.status === 'warning').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Minor issues detected
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Red Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {mockContracts.filter(c => c.status === 'danger').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Serious issues detected
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contracts;
