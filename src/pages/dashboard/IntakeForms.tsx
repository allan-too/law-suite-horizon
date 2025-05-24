
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IntakeFormForm } from '@/components/forms/IntakeFormForm';
import { IntakeFormCard } from '@/components/cards/IntakeFormCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FormField {
  id: string;
  type: 'text' | 'select' | 'date' | 'checkbox' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
}

interface IntakeForm {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  status: 'Active' | 'Archived';
  createdAt: string;
}

const IntakeForms: React.FC = () => {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<IntakeForm | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

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

  // Mock intake forms data - in production, this would come from an API
  const [intakeForms, setIntakeForms] = useState<IntakeForm[]>([
    {
      id: '1',
      title: 'General Client Intake',
      description: 'Standard intake form for new clients seeking legal services',
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true },
        { id: '2', type: 'text', label: 'Email Address', required: true },
        { id: '3', type: 'text', label: 'Phone Number', required: true },
        { id: '4', type: 'textarea', label: 'Legal Issue Description', required: true },
        { id: '5', type: 'select', label: 'Jurisdiction', required: true, options: ['United States', 'Canada', 'United Kingdom'] },
      ],
      status: 'Active',
      createdAt: '2023-05-12T10:00:00Z',
    },
    {
      id: '2',
      title: 'Corporate Client Intake',
      description: 'Specialized form for corporate and business clients',
      fields: [
        { id: '1', type: 'text', label: 'Company Name', required: true },
        { id: '2', type: 'text', label: 'Contact Person', required: true },
        { id: '3', type: 'text', label: 'Business Email', required: true },
        { id: '4', type: 'select', label: 'Company Size', required: false, options: ['1-10', '11-50', '51-200', '200+'] },
        { id: '5', type: 'textarea', label: 'Legal Matter', required: true },
      ],
      status: 'Active',
      createdAt: '2023-05-08T14:30:00Z',
    },
    {
      id: '3',
      title: 'Family Law Questionnaire',
      description: 'Comprehensive form for family law matters',
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true },
        { id: '2', type: 'date', label: 'Date of Birth', required: true },
        { id: '3', type: 'select', label: 'Marital Status', required: true, options: ['Single', 'Married', 'Divorced', 'Widowed'] },
        { id: '4', type: 'checkbox', label: 'Children Involved', required: false },
        { id: '5', type: 'textarea', label: 'Case Details', required: true },
      ],
      status: 'Active',
      createdAt: '2023-04-25T09:15:00Z',
    },
    {
      id: '4',
      title: 'Personal Injury Intake',
      description: 'Form for personal injury and accident cases',
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true },
        { id: '2', type: 'date', label: 'Incident Date', required: true },
        { id: '3', type: 'textarea', label: 'Incident Description', required: true },
      ],
      status: 'Archived',
      createdAt: '2023-05-01T16:45:00Z',
    },
  ]);

  const handleAddForm = () => {
    setEditingForm(undefined);
    setIsFormOpen(true);
  };

  const handleEditForm = (form: IntakeForm) => {
    setEditingForm(form);
    setIsFormOpen(true);
  };

  const handleDeleteForm = (formId: string) => {
    setFormToDelete(formId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      // In production, make API call to delete form
      // await fetch(`/api/forms/${formToDelete}`, { method: 'DELETE' });
      setIntakeForms(prev => prev.filter(form => form.id !== formToDelete));
      setFormToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSubmitForm = (formData: IntakeForm) => {
    if (editingForm) {
      // Update existing form
      setIntakeForms(prev => prev.map(form => 
        form.id === editingForm.id ? { ...formData, id: editingForm.id } : form
      ));
    } else {
      // Add new form
      const newForm = {
        ...formData,
        id: Date.now().toString(), // In production, this would be generated by the backend
        createdAt: new Date().toISOString(),
      };
      setIntakeForms(prev => [...prev, newForm]);
    }
  };

  const getStatusCounts = () => {
    return {
      active: intakeForms.filter(f => f.status === 'Active').length,
      archived: intakeForms.filter(f => f.status === 'Archived').length,
      total: intakeForms.length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Intake Forms"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Intake Forms</h2>
            <p className="text-muted-foreground mt-1">
              Create and manage client intake form templates
            </p>
          </div>
          <Button onClick={handleAddForm}>
            Add Intake Form
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{statusCounts.active}</div>
              <p className="text-xs text-muted-foreground">
                Active Forms
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{statusCounts.archived}</div>
              <p className="text-xs text-muted-foreground">
                Archived Forms
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{statusCounts.total}</div>
              <p className="text-xs text-muted-foreground">
                Total Forms
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {intakeForms.map((form) => (
            <IntakeFormCard
              key={form.id}
              form={form}
              onEdit={handleEditForm}
              onDelete={handleDeleteForm}
            />
          ))}
        </div>

        {intakeForms.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No intake forms yet. Create your first form template to get started.</p>
            </CardContent>
          </Card>
        )}
        
        <IntakeFormForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          form={editingForm}
          onSubmit={handleSubmitForm}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Intake Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this intake form? This action cannot be undone and will also remove any associated form submissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default IntakeForms;
