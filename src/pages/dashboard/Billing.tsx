
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
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const Billing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Mock subscription details
  const mockSubscription = {
    plan: user?.subscriptionType || 'basic',
    status: 'active',
    nextBilling: '2023-06-15',
    amount: user?.subscriptionType === 'professional' ? '$99.00' : 
            user?.subscriptionType === 'enterprise' ? '$199.00' : '$49.00',
    paymentMethod: 'PayPal',
    autoRenew: true
  };

  // Mock invoice data
  const mockInvoices = [
    { id: 'INV-2023-001', date: '2023-05-15', amount: '$49.00', status: 'paid' },
    { id: 'INV-2023-002', date: '2023-04-15', amount: '$49.00', status: 'paid' },
    { id: 'INV-2023-003', date: '2023-03-15', amount: '$49.00', status: 'paid' },
    { id: 'INV-2023-004', date: '2023-02-15', amount: '$49.00', status: 'paid' },
    { id: 'INV-2023-005', date: '2023-01-15', amount: '$49.00', status: 'paid' },
  ];

  // Format plan name for display
  const formatPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic';
      case 'professional': return 'Professional';
      case 'enterprise': return 'Enterprise';
      default: return 'Basic';
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Billing & Subscription"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your subscription plan and payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Plan:</span>
                <Badge variant="outline" className="capitalize">
                  {formatPlanName(mockSubscription.plan)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Billing Amount:</span>
                <span>{mockSubscription.amount} / month</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Next Billing Date:</span>
                <span>{new Date(mockSubscription.nextBilling).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{mockSubscription.paymentMethod}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Auto Renew:</span>
                <Badge variant={mockSubscription.autoRenew ? "outline" : "secondary"}>
                  {mockSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => navigate('/pricing')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Change Plan
                </button>
                <button 
                  className="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10"
                  onClick={() => {}}
                >
                  Cancel Subscription
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Methods Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">PP</span>
                  </div>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
              
              <button 
                className="w-full px-4 py-2 mt-4 border border-input hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => {}}
              >
                Add Payment Method
              </button>
            </CardContent>
          </Card>
        </div>
        
        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>View and download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Invoice</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{invoice.id}</td>
                      <td className="px-4 py-3">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{invoice.amount}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={invoice.status === 'paid' ? 'outline' : 'secondary'}
                          className={invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' : ''}
                        >
                          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                          onClick={() => {}}
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </button>
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

export default Billing;
