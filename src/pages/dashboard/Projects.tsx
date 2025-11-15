import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "@/schemas/projectSchema";
import { Project } from "@/lib/types";
import { projectField } from "@/components/shared/formFields";
import { apiService, MEDIA_URL } from "@/api/apiService";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techOptions, setTechOptions] = useState<{ label: string; value: string }[]>([]);
  const [techMap, setTechMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      media_path: "",
      media_alt: "",
      technology_ids: [],
      project_link: "",
      github_link: "",
      status: true,
      sort_order: 1,
    },
  });

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAll("projects");
      // Map technologies to tech IDs array for the form
      const mapped = data.map((proj: any) => ({
        ...proj,
        technology_ids: proj.technologies_list?.map((t: any) => String(t.id)) || [],
      }));
      setProjects(mapped || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch technologies
  const fetchTechnologies = useCallback(async () => {
    try {
      const data = await apiService.getAll("technology/active-true");

      const options = data?.data?.map((tech: any) => ({
        label: tech.name,
        value: String(tech.id),
      })) || [];

      const map: Record<string, string> = {};
      options.forEach((data) => (map[data.value] = data.label));

      setTechOptions(options);
      setTechMap(map);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load technologies");
      setTechOptions([]);
      setTechMap({});
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchTechnologies();
  }, [fetchProjects, fetchTechnologies]);

  // Handle Submit
  const handleSubmit = async (data: ProjectFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("media_alt", data.media_alt || "");
      formData.append("project_link", data.project_link || "");
      formData.append("github_link", data.github_link || "");
      formData.append("status", data.status ? "true" : "false");
      formData.append("sort_order", String(data.sort_order));

      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      // Multiple technologies
      if (data.technology_ids?.length) {
        formData.append(
          "technologies",
          JSON.stringify(data.technology_ids.map(Number))
        );
      }

      if (editingProject) {
        const updatedProject = await apiService.update(
          "projects",
          editingProject.id,
          formData
        );

        // Verify the response has required fields
        if (updatedProject && updatedProject.id) {
          // Map technology_ids like in fetchProjects
          const mappedProject = {
            ...updatedProject,
            technology_ids: updatedProject.technologies_list?.map((t: any) => String(t.id)) || [],
          };

          setProjects((prev) =>
            prev.map((s) => (s.id === editingProject.id ? mappedProject : s))
          );
          toast.success("Project updated successfully!");
        } else {
          // Fallback: refetch if response is incomplete
          await fetchProjects();
          toast.success("Project updated successfully!");
        }
      } else {
        const newProject = await apiService.create("projects", formData, true);

        // Verify the response has required fields
        if (newProject && newProject.id) {
          const mappedProject = {
            ...newProject,
            technology_ids: newProject.technologies_list?.map((t: any) => String(t.id)) || [],
          };

          setProjects((prev) => [...prev, mappedProject]);
          toast.success("Project added successfully!");
        } else {
          // Fallback: refetch if response is incomplete
          await fetchProjects();
          toast.success("Project added successfully!");
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  // Edit Project
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);

    console.log("project", project);

    form.reset({
      title: project.title || "",
      description: project.description || "",
      technology_ids: project.technology_ids || [],
      project_link: project.project_link || "",
      media_path: project.media_path || "",
      github_link: project.github_link || "",
      sort_order: project.sort_order || 1,
      status: project.status ?? true,
      media_alt: project.media_alt || "",
    });
  };

  const handleDelete = async (project: Project) => {
    try {
      // Uncomment when API is ready
      // await apiService.remove("projects", project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      technology_ids: [],
      project_link: "",
      github_link: "",
      media_path: "",
      media_alt: "",
      status: true,
      sort_order: 1,
    });
    setEditingProject(null);
  };

  const columns = [
    { 
      header: "ID", 
      accessor: "id",
      cell: (value: number) => value || "N/A"
    },
    {
      header: "Image",
      accessor: "media_path",
      cell: (value: string, row: Project) =>
        value ? (
          <img
            src={`${MEDIA_URL}${value}`}
            alt={row.media_alt || "Project image"}
            className="w-12 h-12 rounded-md object-cover border"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">
            No Image
          </div>
        )
    },
    { 
      header: "Title", 
      accessor: "title",
      cell: (value: string) => value || "Untitled"
    },
    {
      header: "Description",
      accessor: "description",
      cell: (value: string) => (
        <div className="max-w-md truncate">{value || "No description"}</div>
      ),
    },
    {
      header: "Technologies",
      accessor: "technology_ids",
      cell: (value: string[]) => {
        if (!value || value.length === 0) return "No Tech";
        return value.map((id) => techMap[id] || id).join(", ");
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value: boolean) =>
        value ? (
          <span className="text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-gray-500">Inactive</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <DataTable<Project>
        data={projects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        apiPath="projects"
      />

      <FormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editingProject ? "Edit Project" : "Add New Project"}
        description={
          editingProject
            ? "Update project details"
            : "Add a new project to your portfolio"
        }
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingProject ? "Update" : "Create"}
        fields={projectField.map((f) =>
          f.name === "technology_ids" ? { ...f, options: techOptions } : f
        )}
      />
    </div>
  );
};

export default Projects;