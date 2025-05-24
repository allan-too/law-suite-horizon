
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContractForm } from '@/components/forms/ContractForm';
import { ContractCard } from '@/components/cards/ContractCard';
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

interface Client {
  id: string;
  name: string;
}

interface Contract {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  jurisdiction: string;
  status: 'Draft' | 'Signed' | 'Flagged';
  description: string;
  fileName?: string;
  uploadedDate: string;
}

const Contracts: React.FC = () => {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);

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

  // Mock data - in production, this would come from APIs
  const [clients] = useState<Client[]>([
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Lisa Johnson' },
    { id: '3', name: 'Michael Brown' },
  ]);

  const [contracts, setContracts] = useState<Contract[]>([
    { 
      id: '1', 
      title: 'Service Agreement - Smith', 
      clientId: '1',
      clientName: 'John Smith',
      jurisdiction: 'United States',
      status: 'Signed',
      description: 'Legal services retainer agreement for ongoing business consultation.',
      fileName: 'service-agreement-smith.pdf',
      uploadedDate: '2023-05-12',
    },
    { 
      id: '2', 
      title: 'Employment Contract - Johnson', 
      clientId: '2',
      clientName: 'Lisa Johnson',
      jurisdiction: 'Canada',
      status: 'Draft',
      description: 'Executive employment contract with non-compete clauses.',
      fileName: 'employment-contract-johnson.pdf',
      uploadedDate: '2023-05-10',
    },
    { 
      id: '3', 
      title: 'Property Purchase Agreement', 
      clientId: '3',
      clientName: 'Michael Brown',
      jurisdiction: 'United Kingdom',
      status: 'Flagged',
      description: 'Commercial property acquisition with title issues requiring resolution.',
      fileName: 'property-purchase-agreement.pdf',
      uploadedDate: '2023-05-05',
    },
  ]);

  const handleAddContract = () => {
    setEditingContract(undefined);
    setIsFormOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setIsFormOpen(true);
  };

  const handleDeleteContract = (contractId: string) => {
    setContractToDelete(contractId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewContract = (contractId: string) => {
    // In production, this would open the PDF file
    const contract = contracts.find(c => c.id === contractId);
    if (contract?.fileName) {
      console.log(`Opening contract: ${contract.fileName}`);
      // window.open(`/api/contracts/${contractId}/file`, '_blank');
    }
  };

  const confirmDelete = () => {
    if (contractToDelete) {
      // In production, make API call to delete contract and file
      // await fetch(`/api/contracts/${contractToDelete}`, { method: 'DELETE' });
      setContracts(prev => prev.filter(contract => contract.id !== contractToDelete));
      setContractToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSubmitContract = (contractData: Contract, file?: File) => {
    if (editingContract) {
      // Update existing contract
      setContracts(prev => prev.map(contract => 
        contract.id === editingContract.id ? { 
          ...contractData, 
          id: editingContract.id,
          clientName: clients.find(c => c.id === contractData.clientId)?.name || '',
          uploadedDate: editingContract.uploadedDate,
          fileName: editingContract.fileName
        } : contract
      ));
    } else {
      // Add new contract
      const newContract = {
        ...contractData,
        id: Date.now().toString(), // In production, this would be generated by the backend
        clientName: clients.find(c => c.id === contractData.clientId)?.name || '',
        uploadedDate: new Date().toISOString().split('T')[0],
        fileName: file?.name || undefined,
      };
      setContracts(prev => [...prev, newContract]);
      
      // In production, upload the file here
      if (file) {
        console.log('Uploading file:', file.name);
        // const formData = new FormData();
        // formData.append('contract', file);
        // await fetch('/api/contracts/upload', { method: 'POST', body: formData });
      }
    }
  };

  const getStatusCounts = () => {
    return {
      draft: contracts.filter(c => c.status === 'Draft').length,
      signed: contracts.filter(c => c.status === 'Signed').length,
      flagged: contracts.filter(c => c.status === 'Flagged').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Contract Management"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Contracts</h2>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your legal contracts
            </p>
          </div>
          <Button onClick={handleAddContract}>
            New Contract
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Draft Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.draft}</div>
              <p className="text-xs text-muted-foreground">
                Pending signature
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Signed Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.signed}</div>
              <p className="text-xs text-muted-foreground">
                Active agreements
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Flagged Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{statusCounts.flagged}</div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onEdit={handleEditContract}
              onDelete={handleDeleteContract}
              onPreview={handlePreviewContract}
            />
          ))}
        </div>

        {contracts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No contracts yet. Add your first contract to get started.</p>
            </CardContent>
          </Card>
        )}
        
        <ContractForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          contract={editingContract}
          clients={clients}
          onSubmit={handleSubmitContract}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contract</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this contract? This action cannot be undone and will remove both the contract record and the uploaded file.
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

export default Contracts;
