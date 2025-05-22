
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  AlertTriangle,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminLogs: React.FC = () => {
  const location = useLocation();

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

  // Mock logs data
  const mockLogs = [
    { 
      id: 1, 
      type: 'error', 
      message: 'Failed to process payment for user ID 103', 
      timestamp: '2023-05-12T14:32:10', 
      source: 'payment-service',
    },
    { 
      id: 2, 
      type: 'warning', 
      message: 'Rate limit exceeded for API key ABC123', 
      timestamp: '2023-05-12T13:45:22', 
      source: 'api-gateway',
    },
    { 
      id: 3, 
      type: 'info', 
      message: 'User John Smith (ID: 42) logged in', 
      timestamp: '2023-05-12T13:15:05', 
      source: 'auth-service',
    },
    { 
      id: 4, 
      type: 'info', 
      message: 'Document ID 789 uploaded by user ID 42', 
      timestamp: '2023-05-12T12:55:18', 
      source: 'document-service',
    },
    { 
      id: 5, 
      type: 'error', 
      message: 'Database connection timeout in document analyzer', 
      timestamp: '2023-05-12T12:30:45', 
      source: 'analyzer-service',
    },
    { 
      id: 6, 
      type: 'warning', 
      message: 'High CPU usage detected on backend server', 
      timestamp: '2023-05-12T12:10:33', 
      source: 'monitoring-service',
    },
    { 
      id: 7, 
      type: 'info', 
      message: 'System backup completed successfully', 
      timestamp: '2023-05-12T12:00:00', 
      source: 'backup-service',
    },
    { 
      id: 8, 
      type: 'error', 
      message: 'Failed to send email notification to user ID 78', 
      timestamp: '2023-05-12T11:45:19', 
      source: 'notification-service',
    },
    { 
      id: 9, 
      type: 'info', 
      message: 'New user Lisa Johnson (ID: 105) registered', 
      timestamp: '2023-05-12T11:30:22', 
      source: 'auth-service',
    },
    { 
      id: 10, 
      type: 'warning', 
      message: 'Suspicious login attempt for user ID 67', 
      timestamp: '2023-05-12T11:15:08', 
      source: 'security-service',
    },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <Badge variant="destructive">Error</Badge>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
              Warning
            </Badge>
          </div>
        );
      case 'info':
        return (
          <div className="flex items-center gap-1">
            <Info className="h-4 w-4 text-blue-500" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              Info
            </Badge>
          </div>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter logs by type
  const errorLogs = mockLogs.filter(log => log.type === 'error');
  const warningLogs = mockLogs.filter(log => log.type === 'warning');
  const infoLogs = mockLogs.filter(log => log.type === 'info');

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="System Logs"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Export Logs
          </button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{errorLogs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Warning Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{warningLogs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Info Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{infoLogs.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Message</th>
                        <th className="px-4 py-3 text-left">Source</th>
                        <th className="px-4 py-3 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">{getTypeBadge(log.type)}</td>
                          <td className="px-4 py-3 font-medium max-w-md truncate">{log.message}</td>
                          <td className="px-4 py-3">{log.source}</td>
                          <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Message</th>
                        <th className="px-4 py-3 text-left">Source</th>
                        <th className="px-4 py-3 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">{getTypeBadge(log.type)}</td>
                          <td className="px-4 py-3 font-medium max-w-md truncate">{log.message}</td>
                          <td className="px-4 py-3">{log.source}</td>
                          <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="warnings" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Message</th>
                        <th className="px-4 py-3 text-left">Source</th>
                        <th className="px-4 py-3 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warningLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">{getTypeBadge(log.type)}</td>
                          <td className="px-4 py-3 font-medium max-w-md truncate">{log.message}</td>
                          <td className="px-4 py-3">{log.source}</td>
                          <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Message</th>
                        <th className="px-4 py-3 text-left">Source</th>
                        <th className="px-4 py-3 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {infoLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">{getTypeBadge(log.type)}</td>
                          <td className="px-4 py-3 font-medium max-w-md truncate">{log.message}</td>
                          <td className="px-4 py-3">{log.source}</td>
                          <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminLogs;
