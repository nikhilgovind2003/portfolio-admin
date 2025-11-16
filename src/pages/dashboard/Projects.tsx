
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "@/schemas/projectSchema";
import { Project, Technology } from "@/lib/types";
import { projectField } from "@/components/shared/formFields";
import { apiService, MEDIA_URL } from "@/api/apiService";
import { PaginationInfo } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techOptions, setTechOptions] = useState<{ label: string; value: string }[]>([]);
  const [techMap, setTechMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination states
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fetch projects with pagination
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAll("projects", {
        page: currentPage,
        limit: limit,
        search: searchQuery,
      });

      
      const mapped = response.data.map((project: Project) => ({
        ...project,
        technology_ids: projects.technologies_list?.map((tech: Technology) => String(tech.id)) || [],
      }));
      
      console.log("Fetched projects:", mapped);
      setProjects(mapped || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchQuery]);

  // Fetch technologies
  const fetchTechnologies = useCallback(async () => {
    try {
      const data = await apiService.getAll("technology/active-true");

      const options = data?.data?.map((tech: Technology) => ({
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
  }, [fetchProjects]);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

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

      if (data.technology_ids?.length) {
        formData.append(
          "technologies",
          JSON.stringify(data.technology_ids.map(Number))
        );
      }

      if (editingProject) {
        await apiService.update("projects", editingProject.id, formData);
        toast.success("Project updated successfully!");
      } else {
        await apiService.create("projects", formData, true);
        toast.success("Project added successfully!");
      }

      // Refetch to get updated paginated data
      await fetchProjects();
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
      // await apiService.remove("projects", Number(project.id));
      // toast.success("Project deleted successfully!");
      
      // Refetch to update pagination
      await fetchProjects();
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

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable<Project>
        data={projects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        apiPath="projects"
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
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