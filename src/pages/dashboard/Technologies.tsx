import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog, FormFieldConfig } from '@/components/shared/FormDialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { technologySchema, TechnologyFormData } from '@/schemas/technologySchema';

interface Technology {
  id: string;
  name: string;
  category: string;
  projectCount: number;
}

const formFields: FormFieldConfig[] = [
  { name: 'name', label: 'Technology Name', type: 'text', placeholder: 'React' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Framework, Library, Tool' },
];

const Technologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);

  const form = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: '',
      category: '',
    },
  });

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Technology },
    { header: 'Category', accessor: 'category' as keyof Technology },
    { 
      header: 'Projects', 
      accessor: 'projectCount' as keyof Technology,
      cell: (value: number) => <span className="text-muted-foreground">{value} projects</span>
    },
  ];

  const handleSubmit = (data: TechnologyFormData) => {
    const techData: Technology = {
      id: editingTech?.id || crypto.randomUUID(),
      name: data.name,
      category: data.category,
      projectCount: editingTech?.projectCount || 0,
    };

    if (editingTech) {
      setTechnologies(technologies.map(t => t.id === editingTech.id ? techData : t));
      toast.success('Technology updated successfully');
    } else {
      setTechnologies([...technologies, techData]);
      toast.success('Technology created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    form.reset({ name: tech.name, category: tech.category });
    setIsDialogOpen(true);
  };

  const handleDelete = (tech: Technology) => {
    setTechnologies(technologies.filter(t => t.id !== tech.id));
    toast.success('Technology deleted successfully');
  };

  const resetForm = () => {
    form.reset({
      name: '',
      category: '',
    });
    setEditingTech(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technologies</h1>
          <p className="text-muted-foreground">Manage technologies in your stack</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Technology
        </Button>
      </div>

      <DataTable
        data={technologies}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editingTech ? 'Edit Technology' : 'Add New Technology'}
        description={editingTech ? 'Update technology information' : 'Add a new technology to your stack'}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingTech ? 'Update' : 'Create'}
        fields={formFields}
      />
    </div>
  );
};

export default Technologies;
