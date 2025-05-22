
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock data for the dashboard
  const mockData = {
    activeClients: 8,
    documentsUploaded: 24,
    documentsToReview: 3,
    contracts: [
      { id: 1, name: 'Service Agreement - Smith', status: 'good', date: '2023-05-12' },
      { id: 2, name: 'Retainer - Johnson LLC', status: 'warning', date: '2023-05-10' },
      { id: 3, name: 'NDA - Tech Solutions', status: 'danger', date: '2023-05-05' },
    ],
    notifications: [
      { id: 1, message: 'Missing signature on Johnson LLC retainer', type: 'warning' },
      { id: 2, message: 'Clause 4.2 in Tech Solutions NDA may be problematic', type: 'danger' },
      { id: 3, message: 'Service Agreement for Smith is ready for signature', type: 'success' },
    ],
  };

  // Simulate file upload progress
  const handleFileDrop = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

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

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Attorney Dashboard"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Attorney'}</h2>
          <p className="text-muted-foreground">
            Here's an overview of your legal practice and documents.
          </p>
        </div>
    
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                +2 new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.documentsUploaded}</div>
              <p className="text-xs text-muted-foreground">
                {mockData.documentsToReview} need review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="capitalize text-2xl font-bold">
                {user?.subscriptionType || 'Basic'}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.subscriptionType === 'professional' ? '42 days remaining' : 
                  user?.subscriptionType === 'enterprise' ? '95 days remaining' : '14 days remaining'}
              </p>
            </CardContent>
          </Card>
        </div>
    
        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Important updates about your legal documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockData.notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className="flex items-center space-x-3 rounded-md border p-3"
                    >
                      {getNotificationIcon(notification.type)}
                      <span>{notification.message}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Contract Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Status</CardTitle>
                  <CardDescription>Recent contracts and their health status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockData.contracts.map(contract => (
                    <div 
                      key={contract.id} 
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{contract.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Updated: {new Date(contract.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(contract.status)}
                        <Badge
                          variant={
                            contract.status === 'good' ? 'outline' : 
                            contract.status === 'warning' ? 'secondary' : 'destructive'
                          }
                        >
                          {contract.status === 'good' ? 'Good to sign' : 
                           contract.status === 'warning' ? 'Needs attention' : 'Red flag'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload legal documents for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileDrop();
                  }}
                >
                  <div className="mx-auto flex flex-col items-center gap-1">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag files here or click to browse</p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, DOCX, DOC
                    </p>
                  </div>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Uploading document...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : uploadProgress === 100 ? (
                  <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3 flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Document uploaded successfully and sent for analysis</span>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your recently uploaded legal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Upload a document to see it here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contract Management</CardTitle>
                <CardDescription>Manage and analyze your legal contracts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  View contract details, status, and AI-powered clause analysis
                </p>
                
                {/* Contract list */}
                <div className="space-y-2">
                  {mockData.contracts.map(contract => (
                    <div 
                      key={contract.id} 
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{contract.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Updated: {new Date(contract.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            contract.status === 'good' ? 'outline' : 
                            contract.status === 'warning' ? 'secondary' : 'destructive'
                          }
                        >
                          {contract.status === 'good' ? 'Good to sign' : 
                           contract.status === 'warning' ? 'Needs attention' : 'Red flag'}
                        </Badge>
                        <div 
                          className="cursor-pointer"
                          onClick={() => navigate(`/dashboard/contracts/${contract.id}`)}
                        >
                          <FileText className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
