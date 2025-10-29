import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog, FormFieldConfig } from '@/components/shared/FormDialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  skills: z.string().max(500, 'Skills must be less than 500 characters'),
  technologies: z.string().max(500, 'Technologies must be less than 500 characters'),
  media_path: z.string().optional(),
  project_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string;
  technologies: string;
  media_path?: string;
  project_link?: string;
  github_link?: string;
}

const formFields: FormFieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Project name' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed description...', rows: 4 },
  { name: 'skills', label: 'Skills', type: 'text', placeholder: 'e.g., React, TypeScript' },
  { name: 'technologies', label: 'Technologies', type: 'text', placeholder: 'e.g., Node.js, MongoDB' },
  { name: 'media_path', label: 'Media Path', type: 'text', placeholder: '/images/project.png' },
  { name: 'project_link', label: 'Project Link', type: 'url', placeholder: 'https://example.com' },
  { name: 'github_link', label: 'GitHub Link', type: 'url', placeholder: 'https://github.com/username/repo' },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      skills: '',
      technologies: '',
      media_path: '',
      project_link: '',
      github_link: '',
    },
  });

  const columns = [
    { header: 'Title', accessor: 'title' as keyof Project },
    { 
      header: 'Description', 
      accessor: 'description' as keyof Project,
      cell: (value: string) => (
        <div className="max-w-md truncate">{value}</div>
      )
    },
    { header: 'Skills', accessor: 'skills' as keyof Project },
    { header: 'Technologies', accessor: 'technologies' as keyof Project },
  ];

  const handleSubmit = (data: z.infer<typeof projectSchema>) => {
    const projectData: Project = {
      id: editingProject?.id || crypto.randomUUID(),
      title: data.title,
      description: data.description,
      skills: data.skills,
      technologies: data.technologies,
      media_path: data.media_path || '',
      project_link: data.project_link || '',
      github_link: data.github_link || '',
    };

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? projectData : p));
      toast.success('Project updated successfully');
    } else {
      setProjects([...projects, projectData]);
      toast.success('Project created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset(project);
    setIsDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setProjects(projects.filter(p => p.id !== project.id));
    toast.success('Project deleted successfully');
  };

  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      skills: '',
      technologies: '',
      media_path: '',
      project_link: '',
      github_link: '',
    });
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your project portfolio</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <DataTable
        data={projects}
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
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        description={editingProject ? 'Update project information' : 'Create a new project entry'}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingProject ? 'Update' : 'Create'}
        fields={formFields}
      />
    </div>
  );
};

export default Projects;
