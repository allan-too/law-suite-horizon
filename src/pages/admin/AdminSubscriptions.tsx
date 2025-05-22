
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminSubscriptions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items for the sidebar
  const sidebarItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard',
    },
    { 
      title: 'All Users', 
      icon: Users, 
      href: '/admin/users',
      active: location.pathname === '/admin/users',
    },
    { 
      title: 'Subscriptions', 
      icon: CreditCard, 
      href: '/admin/subscriptions',
      active: location.pathname === '/admin/subscriptions',
    },
    { 
      title: 'Documents', 
      icon: FileText, 
      href: '/admin/documents',
      active: location.pathname === '/admin/documents',
    },
    { 
      title: 'System Logs', 
      icon: FileText, 
      href: '/admin/logs',
      active: location.pathname === '/admin/logs',
    },
    { 
      title: 'Platform Settings', 
      icon: Settings, 
      href: '/admin/platform',
      active: location.pathname === '/admin/platform',
    },
  ];

  // Mock subscription data
  const mockSubscriptions = [
    { 
      id: 1, 
      user: 'John Smith', 
      email: 'john@example.com', 
      plan: 'basic', 
      status: 'active',
      amount: '$49.00',
      startDate: '2023-05-01',
      nextBilling: '2023-06-01',
      paymentMethod: 'PayPal',
    },
    { 
      id: 2, 
      user: 'Lisa Johnson', 
      email: 'lisa@example.com', 
      plan: 'professional', 
      status: 'active',
      amount: '$99.00',
      startDate: '2023-04-15',
      nextBilling: '2023-05-15',
      paymentMethod: 'PayPal',
    },
    { 
      id: 3, 
      user: 'Michael Brown', 
      email: 'michael@example.com', 
      plan: 'basic', 
      status: 'inactive',
      amount: '$49.00',
      startDate: '2023-03-22',
      nextBilling: 'N/A',
      paymentMethod: 'PayPal',
    },
    { 
      id: 4, 
      user: 'Sarah Williams', 
      email: 'sarah@example.com', 
      plan: 'enterprise', 
      status: 'active',
      amount: '$199.00',
      startDate: '2023-01-10',
      nextBilling: '2023-06-10',
      paymentMethod: 'PayPal',
    },
    { 
      id: 5, 
      user: 'Robert Davis', 
      email: 'robert@example.com', 
      plan: 'professional', 
      status: 'payment_issue',
      amount: '$99.00',
      startDate: '2023-04-05',
      nextBilling: '2023-05-05',
      paymentMethod: 'PayPal',
    },
  ];

  // Summary data
  const subscriptionCounts = {
    basic: mockSubscriptions.filter(sub => sub.plan === 'basic').length,
    professional: mockSubscriptions.filter(sub => sub.plan === 'professional').length,
    enterprise: mockSubscriptions.filter(sub => sub.plan === 'enterprise').length,
  };

  const monthlyRevenue = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => {
      return total + parseFloat(sub.amount.replace('$', ''));
    }, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
              Active
            </Badge>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-gray-500" />
            <Badge variant="secondary">Inactive</Badge>
          </div>
        );
      case 'payment_issue':
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
              Payment Issue
            </Badge>
          </div>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Badge variant="outline">Basic</Badge>;
      case 'professional':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">Professional</Badge>;
      case 'enterprise':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Subscription Management"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${monthlyRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Basic Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subscriptionCounts.basic}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pro Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subscriptionCounts.professional}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enterprise Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subscriptionCounts.enterprise}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Start Date</th>
                    <th className="px-4 py-3 text-left">Next Billing</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{sub.user}</td>
                      <td className="px-4 py-3">{sub.email}</td>
                      <td className="px-4 py-3 capitalize">{getPlanBadge(sub.plan)}</td>
                      <td className="px-4 py-3">{sub.amount}</td>
                      <td className="px-4 py-3">{new Date(sub.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{sub.nextBilling === 'N/A' ? 'N/A' : new Date(sub.nextBilling).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/admin/subscriptions/${sub.id}`)}
                            className="text-sm text-primary hover:underline"
                          >
                            Details
                          </button>
                          <button 
                            className="text-sm text-amber-600 hover:underline"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptions;
