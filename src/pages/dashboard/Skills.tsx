import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog, FormFieldConfig } from '@/components/shared/FormDialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { apiService } from '@/api/apiService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  category: z.string().max(100).optional(),
});

interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

const formFields: FormFieldConfig[] = [
  { name: 'name', label: 'Skill Name', type: 'text', placeholder: 'React' },
  { 
    name: 'level', 
    label: 'Proficiency Level', 
    type: 'select',
    options: [
      { label: 'Beginner', value: 'beginner' },
      { label: 'Intermediate', value: 'intermediate' },
      { label: 'Advanced', value: 'advanced' },
      { label: 'Expert', value: 'expert' },
    ]
  },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Frontend, Backend, DevOps' },
];

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      level: 'intermediate',
      category: '',
    },
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await apiService.getAll("skills");
        setSkills(data);
      } catch (err: any) {
        toast.error("Failed to load skills");
      }
    };
    fetchSkills();
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Skill },
    { 
      header: 'Level', 
      accessor: 'level' as keyof Skill,
      cell: (value: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
          beginner: 'secondary',
          intermediate: 'outline',
          advanced: 'default',
          expert: 'default',
        };
        return <Badge variant={variants[value]}>{value}</Badge>;
      }
    },
    { header: 'Category', accessor: 'category' as keyof Skill },
  ];

  const handleSubmit = (data: z.infer<typeof skillSchema>) => {
    const skillData: Skill = {
      id: editingSkill?.id || crypto.randomUUID(),
      name: data.name,
      level: data.level,
      category: data.category,
    };

    if (editingSkill) {
      setSkills(skills.map(s => s.id === editingSkill.id ? skillData : s));
      toast.success('Skill updated successfully');
    } else {
      setSkills([...skills, skillData]);
      toast.success('Skill created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    form.reset(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setSkills(skills.filter(s => s.id !== skill.id));
    toast.success('Skill deleted successfully');
  };

  const resetForm = () => {
    form.reset({
      name: '',
      level: 'intermediate',
      category: '',
    });
    setEditingSkill(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground">Manage your skill set</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <DataTable
        data={skills}
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
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        description={editingSkill ? 'Update skill information' : 'Add a new skill to your portfolio'}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingSkill ? 'Update' : 'Create'}
        fields={formFields}
      />
    </div>
  );
};

export default Skills;
