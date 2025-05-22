
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminUsers: React.FC = () => {
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

  // Mock users data
  const mockUsers = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john@example.com', 
      role: 'user', 
      status: 'active',
      subscription: 'basic',
      registerDate: '2023-05-01',
      lastLogin: '2023-05-12',
    },
    { 
      id: 2, 
      name: 'Lisa Johnson', 
      email: 'lisa@example.com', 
      role: 'user', 
      status: 'active',
      subscription: 'professional',
      registerDate: '2023-04-15',
      lastLogin: '2023-05-10',
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      email: 'michael@example.com', 
      role: 'user', 
      status: 'inactive',
      subscription: 'basic',
      registerDate: '2023-03-22',
      lastLogin: '2023-04-22',
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      email: 'sarah@example.com', 
      role: 'admin', 
      status: 'active',
      subscription: 'enterprise',
      registerDate: '2023-01-10',
      lastLogin: '2023-05-15',
    },
    { 
      id: 5, 
      name: 'Robert Davis', 
      email: 'robert@example.com', 
      role: 'user', 
      status: 'active',
      subscription: 'professional',
      registerDate: '2023-04-05',
      lastLogin: '2023-05-11',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            Active
          </Badge>
        );
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
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
      headerTitle="User Management"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">All Users</h2>
          <button 
            onClick={() => navigate('/admin/users/new')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add User
          </button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockUsers.filter(user => user.status === 'active').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockUsers.filter(user => user.role === 'admin').length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Subscription</th>
                    <th className="px-4 py-3 text-left">Last Login</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                      <td className="px-4 py-3">{getSubscriptionBadge(user.subscription)}</td>
                      <td className="px-4 py-3">{new Date(user.lastLogin).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="text-primary hover:underline"
                          >
                            Edit
                          </button>
                          {user.status === 'active' ? (
                            <button 
                              className="text-amber-600 hover:underline flex items-center"
                              title="Deactivate User"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Deactivate
                            </button>
                          ) : (
                            <button 
                              className="text-green-600 hover:underline flex items-center"
                              title="Activate User"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activate
                            </button>
                          )}
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

export default AdminUsers;
