
import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  Users,
  Database,
  FileArchive,
  Settings as SettingsIcon,
  BarChart2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  // Mock data for the admin dashboard
  const mockData = {
    totalUsers: 128,
    activeUsers: 102,
    totalDocuments: 842,
    processedDocuments: 756,
    subscriptions: {
      basic: 56,
      professional: 42,
      enterprise: 4,
    },
    recentUsers: [
      { id: 1, name: 'Jane Cooper', email: 'jane@example.com', role: 'user', subscription: 'professional', status: 'active' },
      { id: 2, name: 'Robert Fox', email: 'robert@example.com', role: 'user', subscription: 'basic', status: 'active' },
      { id: 3, name: 'Emily Smith', email: 'emily@example.com', role: 'user', subscription: 'enterprise', status: 'inactive' },
      { id: 4, name: 'Michael Johnson', email: 'michael@example.com', role: 'user', subscription: 'professional', status: 'active' },
    ],
    recentDocuments: [
      { id: 1, name: 'Service Agreement.pdf', user: 'Jane Cooper', uploaded: '2023-05-15', size: '1.2MB', status: 'processed' },
      { id: 2, name: 'NDA Template.docx', user: 'Robert Fox', uploaded: '2023-05-14', size: '844KB', status: 'flagged' },
      { id: 3, name: 'Client Contract.pdf', user: 'Emily Smith', uploaded: '2023-05-12', size: '2.1MB', status: 'processing' },
    ],
    systemLogs: [
      { id: 1, event: 'User Login', details: 'Jane Cooper logged in', time: '2023-05-15T14:32:10Z', level: 'info' },
      { id: 2, event: 'Document Upload Failed', details: 'Robert Fox - File exceeds size limit', time: '2023-05-14T10:15:22Z', level: 'error' },
      { id: 3, event: 'Subscription Changed', details: 'Emily Smith upgraded to Enterprise', time: '2023-05-12T08:45:30Z', level: 'info' },
    ],
  };

  // Navigation items for the admin sidebar
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
      icon: Database, 
      href: '/admin/subscriptions',
      active: location.pathname === '/admin/subscriptions',
    },
    { 
      title: 'Documents', 
      icon: FileArchive, 
      href: '/admin/documents',
      active: location.pathname === '/admin/documents',
    },
    { 
      title: 'System Logs', 
      icon: BarChart2, 
      href: '/admin/logs',
      active: location.pathname === '/admin/logs',
    },
    { 
      title: 'Settings', 
      icon: SettingsIcon, 
      href: '/admin/settings',
      active: location.pathname === '/admin/settings',
    },
  ];

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Admin Dashboard"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Platform overview and management tools
          </p>
        </div>
    
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {mockData.activeUsers} active users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {mockData.processedDocuments} processed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Professional Subs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.subscriptions.professional}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((mockData.subscriptions.professional / mockData.totalUsers) * 100)}% of users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enterprise Subs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.subscriptions.enterprise}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((mockData.subscriptions.enterprise / mockData.totalUsers) * 100)}% of users
              </p>
            </CardContent>
          </Card>
        </div>
    
        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="system">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button size="sm">View All Users</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.subscription}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'outline' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="manage">
                            <SelectTrigger className="h-8 w-28">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manage">Manage</SelectItem>
                              <SelectItem value="suspend">Suspend</SelectItem>
                              <SelectItem value="delete">Delete</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>User distribution by subscription type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Basic</span>
                      <span className="text-sm font-medium">{mockData.subscriptions.basic}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(mockData.subscriptions.basic / mockData.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Professional</span>
                      <span className="text-sm font-medium">{mockData.subscriptions.professional}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div 
                        className="h-full bg-legal-blue" 
                        style={{ width: `${(mockData.subscriptions.professional / mockData.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Enterprise</span>
                      <span className="text-sm font-medium">{mockData.subscriptions.enterprise}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div 
                        className="h-full bg-legal-purple" 
                        style={{ width: `${(mockData.subscriptions.enterprise / mockData.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Management Tools</CardTitle>
                  <CardDescription>Administrative actions for user accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="font-medium">Bulk Actions</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Perform actions on multiple user accounts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Export Users</Button>
                      <Button size="sm" variant="outline">Invite Users</Button>
                      <Button size="sm" variant="outline">Send Notifications</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="font-medium">Role Management</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Assign staff and admin privileges
                    </p>
                    <Button size="sm">Manage Roles</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Review and manage uploaded documents</CardDescription>
                </div>
                <Button size="sm">View All Documents</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.recentDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.user}</TableCell>
                        <TableCell>{new Date(doc.uploaded).toLocaleDateString()}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {doc.status === 'processed' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : doc.status === 'flagged' ? (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            )}
                            <span className="capitalize">{doc.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="view">
                            <SelectTrigger className="h-8 w-28">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="view">View</SelectItem>
                              <SelectItem value="reanalyze">Re-analyze</SelectItem>
                              <SelectItem value="delete">Delete</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Document Analysis</CardTitle>
                  <CardDescription>AI document processing statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm">Processed</span>
                        <span className="text-sm font-medium">{mockData.processedDocuments}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary mt-1">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${(mockData.processedDocuments / mockData.totalDocuments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm">Flagged for Review</span>
                        <span className="text-sm font-medium">78</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary mt-1">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${(78 / mockData.totalDocuments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm">Processing Failed</span>
                        <span className="text-sm font-medium">8</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary mt-1">
                        <div 
                          className="h-full bg-destructive" 
                          style={{ width: `${(8 / mockData.totalDocuments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Document Management Tools</CardTitle>
                  <CardDescription>Administrative actions for documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="font-medium">Batch Processing</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Run operations on multiple documents
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Batch Re-analyze</Button>
                      <Button size="sm" variant="outline">Delete Old Documents</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="font-medium">AI Analysis Settings</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure document analysis parameters
                    </p>
                    <Button size="sm">Configure Analysis</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Platform activity and error logs</CardDescription>
                </div>
                <Button size="sm">Export Logs</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.systemLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.event}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>{new Date(log.time).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={log.level === 'error' ? 'destructive' : 'outline'}
                          >
                            {log.level}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Platform configuration options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="font-medium">Maintenance Mode</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Set the system in maintenance mode
                    </p>
                    <Button size="sm" variant="outline">Enable Maintenance Mode</Button>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="font-medium">PayPal Integration</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure payment gateway settings
                    </p>
                    <Button size="sm">Manage Payment Settings</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Status of system components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>API Services</span>
                      </div>
                      <Badge variant="outline">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Database</span>
                      </div>
                      <Badge variant="outline">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Document Processing</span>
                      </div>
                      <Badge variant="outline">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Authentication</span>
                      </div>
                      <Badge variant="outline">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Payment Processing</span>
                      </div>
                      <Badge variant="outline">Operational</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
