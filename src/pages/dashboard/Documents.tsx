
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documents: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

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

  // Mock documents data
  const mockDocuments = [
    { 
      id: 1, 
      name: 'Smith Service Agreement.pdf', 
      uploadDate: '2023-05-12',
      type: 'contract', 
      status: 'analyzed',
      size: '1.2MB',
      client: 'John Smith',
    },
    { 
      id: 2, 
      name: 'Johnson LLC Retainer.docx', 
      uploadDate: '2023-05-10',
      type: 'retainer', 
      status: 'analyzing',
      size: '850KB',
      client: 'Lisa Johnson',
    },
    { 
      id: 3, 
      name: 'Tech Solutions NDA.pdf', 
      uploadDate: '2023-05-05',
      type: 'nda', 
      status: 'analyzed',
      size: '950KB', 
      client: 'Tech Solutions Inc.',
    },
    { 
      id: 4, 
      name: 'Brown Property Agreement.pdf', 
      uploadDate: '2023-05-02',
      type: 'contract', 
      status: 'analyzed',
      size: '1.5MB',
      client: 'Michael Brown',
    },
    { 
      id: 5, 
      name: 'Williams Partnership Terms.pdf', 
      uploadDate: '2023-04-28',
      type: 'contract', 
      status: 'error',
      size: '1.1MB',
      client: 'Sarah Williams',
    },
  ];

  // Simulate file upload progress
  const handleFileDrop = () => {
    setUploadProgress(0);
    setUploadComplete(false);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">Analyzed</Badge>;
      case 'analyzing':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">Analyzing</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Document Management"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground mt-1">
            Upload, analyze, and manage your legal documents
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="retainers">Retainers</TabsTrigger>
            <TabsTrigger value="ndas">NDAs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
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
                ) : uploadComplete ? (
                  <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3 flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Document uploaded successfully and sent for analysis</span>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Document List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Client</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Upload Date</th>
                        <th className="px-4 py-3 text-left">Size</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{doc.name}</td>
                          <td className="px-4 py-3">{doc.client}</td>
                          <td className="px-4 py-3 capitalize">{doc.type}</td>
                          <td className="px-4 py-3">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3">{doc.size}</td>
                          <td className="px-4 py-3">{getStatusBadge(doc.status)}</td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => navigate(`/dashboard/documents/${doc.id}`)}
                              className="text-sm text-primary hover:underline mr-3"
                            >
                              View
                            </button>
                            <button 
                              className="text-sm text-primary hover:underline"
                              onClick={() => {}}
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contract Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 text-muted-foreground">
                  Filtered view of contract documents would appear here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="retainers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Retainer Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 text-muted-foreground">
                  Filtered view of retainer documents would appear here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ndas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>NDA Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 text-muted-foreground">
                  Filtered view of NDA documents would appear here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
