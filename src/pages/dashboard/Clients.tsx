
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Clients: React.FC = () => {
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

  // Mock client data
  const mockClients = [
    { id: 1, name: 'John Smith', email: 'john@example.com', status: 'Active', lastActivity: '2023-05-12' },
    { id: 2, name: 'Lisa Johnson', email: 'lisa@example.com', status: 'Active', lastActivity: '2023-05-10' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', status: 'Inactive', lastActivity: '2023-04-22' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'Active', lastActivity: '2023-05-15' },
    { id: 5, name: 'Robert Davis', email: 'robert@example.com', status: 'Active', lastActivity: '2023-05-11' },
  ];

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Client Management"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <button 
            onClick={() => navigate('/dashboard/clients/new')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add New Client
          </button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Last Activity</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">{client.name}</td>
                      <td className="px-4 py-3">{client.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          client.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(client.lastActivity).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                          className="text-sm text-primary hover:underline mr-3"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
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
      </div>
    </DashboardLayout>
  );
};

export default Clients;
