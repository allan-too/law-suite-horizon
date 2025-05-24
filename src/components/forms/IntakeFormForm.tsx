
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'select' | 'date' | 'checkbox' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
}

interface IntakeForm {
  id?: string;
  title: string;
  description?: string;
  fields: FormField[];
  status: 'Active' | 'Archived';
  createdAt?: string;
}

interface IntakeFormFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form?: IntakeForm;
  onSubmit: (form: IntakeForm) => void;
}

const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'select', 'date', 'checkbox', 'textarea']),
  label: z.string().min(1, 'Field label is required'),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const formSchema = z.object({
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, 'At least one field is required'),
  status: z.enum(['Active', 'Archived']),
});

export const IntakeFormForm: React.FC<IntakeFormFormProps> = ({
  open,
  onOpenChange,
  form: editingForm,
  onSubmit,
}) => {
  const [options, setOptions] = useState<{ [fieldId: string]: string }>({});

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      fields: [
        {
          id: crypto.randomUUID(),
          type: 'text',
          label: 'Full Name',
          required: true,
        },
      ],
      status: 'Active',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'fields',
  });

  useEffect(() => {
    if (editingForm) {
      formMethods.reset({
        title: editingForm.title,
        description: editingForm.description || '',
        fields: editingForm.fields,
        status: editingForm.status,
      });
    } else {
      formMethods.reset({
        title: '',
        description: '',
        fields: [
          {
            id: crypto.randomUUID(),
            type: 'text',
            label: 'Full Name',
            required: true,
          },
        ],
        status: 'Active',
      });
    }
  }, [editingForm, formMethods]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData: IntakeForm = {
      ...data,
      id: editingForm?.id,
      createdAt: editingForm?.createdAt || new Date().toISOString(),
    };
    onSubmit(formData);
    onOpenChange(false);
  };

  const addField = () => {
    append({
      id: crypto.randomUUID(),
      type: 'text',
      label: '',
      required: false,
    });
  };

  const addSelectOption = (fieldId: string) => {
    const option = options[fieldId];
    if (!option) return;

    const currentField = formMethods.getValues(`fields.${fields.findIndex(f => f.id === fieldId)}`);
    if (currentField) {
      const updatedOptions = [...(currentField.options || []), option];
      formMethods.setValue(`fields.${fields.findIndex(f => f.id === fieldId)}.options`, updatedOptions);
      setOptions(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const removeSelectOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = formMethods.getValues(`fields.${fieldIndex}.options`) || [];
    const updatedOptions = currentOptions.filter((_, i) => i !== optionIndex);
    formMethods.setValue(`fields.${fieldIndex}.options`, updatedOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingForm ? 'Edit Intake Form' : 'Create New Intake Form'}
          </DialogTitle>
        </DialogHeader>

        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={formMethods.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., General Client Intake" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formMethods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this intake form..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Form Fields</h3>
                <Button type="button" onClick={addField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        Field {index + 1}
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={formMethods.control}
                        name={`fields.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Label</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formMethods.control}
                        name={`fields.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="text">Text Input</SelectItem>
                                <SelectItem value="textarea">Text Area</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formMethods.control}
                        name={`fields.${index}.required`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-center space-y-0 space-x-2 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Required Field</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {formMethods.watch(`fields.${index}.type`) === 'select' && (
                      <div className="space-y-2">
                        <FormLabel>Dropdown Options</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add option..."
                            value={options[field.id] || ''}
                            onChange={(e) =>
                              setOptions(prev => ({ ...prev, [field.id]: e.target.value }))
                            }
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSelectOption(field.id);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => addSelectOption(field.id)}
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(formMethods.watch(`fields.${index}.options`) || []).map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                            >
                              {option}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removeSelectOption(index, optionIndex)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingForm ? 'Update Form' : 'Create Form'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
