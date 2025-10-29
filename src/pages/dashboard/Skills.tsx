import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog, FormFieldConfig } from '@/components/shared/FormDialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { apiService, MEDIA_URL } from '@/api/apiService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, SkillFormData } from '@/schemas/skillSchema';
interface Skill {
  id: string;
  name: string;
  media_path: string;
}

const formFields: FormFieldConfig[] = [
  { name: 'name', label: 'Skill Name', type: 'text', placeholder: 'React' },
  { name: 'media_path', label: 'Skill Image', type: 'file', accept: 'image/*' },
];

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      media_path: ''
    },
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await apiService.getAll("skills");
        setSkills(data);
      } catch (err) {
        toast.error("Failed to load skills");
      }
    };
    fetchSkills();
  }, []);


  console.log("SKILLS => ", skills)
  const columns = [
    {
      header: 'Image',
      accessor: 'media_path',
      cell: (value: string, row: any) => {

        return value ? (
          <img
            src={`http://localhost:4000${value}`}
            alt={row.name || 'Skill Image'}
            className="w-12 h-12 rounded-md object-cover border shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-100 flex flex-col items-center justify-center border">
            <span className="text-xs text-gray-400">No</span>
            <span className="text-xs text-gray-400">Image</span>
          </div>
        );
      },
    },
    { header: 'Name', accessor: 'skills' },
    { header: 'Sort Order', accessor: 'sort_order' },
    { header: 'Status', accessor: 'status' },
  ];

const handleSubmit = async (data: SkillFormData) => {
  try {
    const formData = new FormData();

    // Append fields
    formData.append("skills", data.name);

    if (data.media_path && data.media_path instanceof FileList && data.media_path[0]) {
      formData.append("media_path", data.media_path[0]); // image file
    }

    // ✅ Send to backend using apiService
    const response = await apiService.create("skills", formData, true);

    // ✅ Update local state after successful save
    setSkills((prev) => [...prev, response]);

    toast.success("Skill added successfully!");
    setIsDialogOpen(false);
    resetForm();
  } catch (error) {
    console.error("Failed to add skill:", error);
    toast.error("Failed to add skill. Please try again.");
  }
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
