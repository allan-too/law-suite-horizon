
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Download, Eye } from 'lucide-react';

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

interface ContractCardProps {
  contract: Contract;
  onEdit: (contract: Contract) => void;
  onDelete: (contractId: string) => void;
  onPreview: (contractId: string) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Signed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Flagged':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {contract.title}
            </h3>
            <Badge className={`${getStatusColor(contract.status)} border-none`}>
              {contract.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(contract.id)}
              title="Preview/Download"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(contract)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(contract.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Client:</span> {contract.clientName}
          </div>
          <div>
            <span className="font-medium">Country:</span> {contract.jurisdiction}
          </div>
          <div>
            <span className="font-medium">Uploaded:</span> {formatDate(contract.uploadedDate)}
          </div>
          {contract.description && (
            <div>
              <span className="font-medium">Notes:</span>
              <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">
                {contract.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
