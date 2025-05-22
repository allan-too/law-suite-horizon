
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
import { Badge } from '@/components/ui/badge';

const IntakeForms: React.FC = () => {
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

  // Mock forms data
  const mockForms = [
    { id: 1, name: 'General Client Intake', responses: 12, lastUpdated: '2023-05-12', status: 'active' },
    { id: 2, name: 'Corporate Client Intake', responses: 5, lastUpdated: '2023-05-08', status: 'active' },
    { id: 3, name: 'Family Law Questionnaire', responses: 8, lastUpdated: '2023-04-25', status: 'active' },
    { id: 4, name: 'Personal Injury Intake', responses: 3, lastUpdated: '2023-05-01', status: 'draft' },
    { id: 5, name: 'Estate Planning Questionnaire', responses: 7, lastUpdated: '2023-04-18', status: 'active' },
  ];

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Intake Forms"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Intake Forms</h2>
          <button 
            onClick={() => navigate('/dashboard/intake-forms/new')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Create New Form
          </button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockForms.map((form) => (
            <Card key={form.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{form.name}</CardTitle>
                  <Badge 
                    variant={form.status === 'active' ? 'outline' : 'secondary'}
                  >
                    {form.status === 'active' ? 'Active' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{form.responses}</span> responses
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(form.lastUpdated).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between pt-2">
                    <button 
                      onClick={() => navigate(`/dashboard/intake-forms/${form.id}`)}
                      className="text-sm text-primary hover:underline"
                    >
                      View Responses
                    </button>
                    <button 
                      onClick={() => navigate(`/dashboard/intake-forms/${form.id}/edit`)}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit Form
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntakeForms;
