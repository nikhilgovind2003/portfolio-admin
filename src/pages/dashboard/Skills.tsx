import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { apiService, MEDIA_URL } from "@/api/apiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, SkillFormData } from "@/schemas/skillSchema";
import { Skill } from "@/lib/types";
import { skillsField } from "@/components/shared/formFields";
import { PaginationInfo } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      media_path: "",
      media_alt: "",
      status: true,
      sort_order: 1,
    },
  });

  // Fetch skills with pagination
  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAll("skills", {
        page: currentPage,
        limit: limit,
        search: searchQuery,
      });
      setSkills(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load skills");
      setSkills([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchQuery]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

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

  // Submit (create or update)
  const handleSubmit = async (data: SkillFormData) => {
    try {
      const formData = new FormData();
      formData.append("skills", data.name);
      formData.append("media_alt", data.media_alt);
      formData.append("sort_order", data.sort_order.toString());
      formData.append("status", data.status ? "true" : "false");
      if (data.media_path instanceof File) formData.append("media_path", data.media_path);

      if (editingSkill) {
        await apiService.update("skills", editingSkill.id, formData);
        toast.success("Skill updated successfully!");
      } else {
        await apiService.create("skills", formData, true);
        toast.success("Skill added successfully!");
      }

      // Refetch to get updated paginated data
      await fetchSkills();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error("Failed to save skill. Please try again.");
    }
  };

  // Edit
  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsDialogOpen(true);
    form.reset({
      name: skill.skills,
      media_path: skill.media_path || "",
      media_alt: skill.media_alt || "",
      status: skill.status,
      sort_order: skill.sort_order,
    });
  };

  // Delete with backend API call and refetch
  const handleDelete = async (skill: Skill) => {
    try {
      // await apiService.remove("skills", Number(skill.id));
      // toast.success("Skill deleted successfully!");
      // Refetch to update pagination
      await fetchSkills();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete skill");
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      media_path: "",
      media_alt: "",
      status: true,
      sort_order: 1,
    });
    setEditingSkill(null);
  };

  const columns = [
    { header: "ID", accessor: "id" },
    {
      header: "Image",
      accessor: "media_path",
      cell: (value: string, row: Skill) =>
        value ? (
          <img
            src={`${MEDIA_URL}${value}`}
            alt={row.media_alt}
            className="w-12 h-12 rounded-md object-cover border"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">
            No Image
          </div>
        ),
    },
    { header: "Name", accessor: "skills" },
    { header: "Sort Order", accessor: "sort_order" },
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
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground">Manage your skills</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>

      {/* Search bar like projects */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable<Skill>
        data={skills}
        columns={columns}
        onEdit={handleEdit}
        apiPath="skills"
        onDelete={handleDelete}
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
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
        description={editingSkill ? "Update skill details" : "Add a new skill"}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingSkill ? "Update" : "Create"}
        fields={skillsField}
      />
    </div>
  );
};

export default Skills;
