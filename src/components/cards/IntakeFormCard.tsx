
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText, Calendar } from 'lucide-react';

interface IntakeForm {
  id: string;
  title: string;
  description?: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
  }>;
  status: 'Active' | 'Archived';
  createdAt: string;
}

interface IntakeFormCardProps {
  form: IntakeForm;
  onEdit: (form: IntakeForm) => void;
  onDelete: (formId: string) => void;
}

export const IntakeFormCard: React.FC<IntakeFormCardProps> = ({
  form,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit(form);
  };

  const handleDelete = () => {
    onDelete(form.id);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Archived':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-medium line-clamp-2">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {form.description}
              </p>
            )}
          </div>
          <Badge variant={getStatusVariant(form.status)}>
            {form.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-medium">{form.fields.length}</span>
            <span className="ml-1">fields</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(form.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Required fields: {form.fields.filter(f => f.required).length}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
