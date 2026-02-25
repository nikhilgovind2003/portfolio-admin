import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { apiService, MEDIA_URL } from "@/api/apiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, ExperienceFormData } from "@/schemas/experienceSchema";
import { Experience as ExperienceType } from "@/lib/types";
import { experienceField } from "@/components/shared/formFields";
import { PaginationInfo } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceType | null>(null);

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

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      media_path: "",
      media_alt: "",
      status: true,
      sort_order: 0,
    },
  });

  // Fetch experiences with pagination
  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAll("experiences", {
        page: currentPage,
        limit: limit,
        search: searchQuery,
      });
      setExperiences(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load experiences");
      setExperiences([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchQuery]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Submit (create or update)
  const handleSubmit = async (data: ExperienceFormData) => {
    try {
      const formData = new FormData();
      formData.append("company", data.company);
      formData.append("role", data.role);
      if (data.location) formData.append("location", data.location);
      formData.append("start_date", data.start_date);
      if (data.end_date) formData.append("end_date", data.end_date);
      formData.append("is_current", data.is_current ? "true" : "false");
      formData.append("description", data.description);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      formData.append("sort_order", data.sort_order.toString());
      formData.append("status", data.status ? "true" : "false");

      if (data.media_path instanceof File)
        formData.append("media_path", data.media_path);

      if (editingExperience) {
        await apiService.update("experiences", editingExperience._id, formData);
        toast.success("Experience updated successfully!");
      } else {
        await apiService.create("experiences", formData, true);
        toast.success("Experience added successfully!");
      }

      await fetchExperiences();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("Failed to save experience. Please try again.");
    }
  };

  // Edit
  const handleEdit = (exp: ExperienceType) => {
    setEditingExperience(exp);
    setIsDialogOpen(true);
    form.reset({
      company: exp.company,
      role: exp.role,
      location: exp.location || "",
      start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : "",
      end_date: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : "",
      is_current: exp.is_current,
      description: exp.description,
      media_path: exp.media_path || "",
      media_alt: exp.media_alt || "",
      status: exp.status,
      sort_order: exp.sort_order,
    });
  };

  // Delete
  const handleDelete = async (exp: ExperienceType) => {
    try {
      // await apiService.remove("experience", exp.id); // If id is number
      // But wait, the Skill.id in original code was number, but API usually uses ObjectId
      // Let's assume remove works with string too if needed.
      // toast.success("Experience deleted successfully!");
      await fetchExperiences();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete experience");
    }
  };

  const resetForm = () => {
    form.reset({
      company: "",
      role: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      media_path: "",
      media_alt: "",
      status: true,
      sort_order: 0,
    });
    setEditingExperience(null);
  };

  const columns = [
    {
      header: "ID",
      accessor: "id",
      width: "60px",
      cell: (_value: any, _row: any, index: number) => index + 1,
    },
    {
      header: "Logo",
      accessor: "media_path",
      cell: (value: string, row: ExperienceType) => {
        return value ? (
          <img
            src={value}
            alt={row.media_alt}
            className="w-12 h-12 rounded-md object-cover border"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">
            No Logo
          </div>
        );
      },
    },
    { header: "Company", accessor: "company", sortable: true },
    { header: "Role", accessor: "role", sortable: true },
    {
      header: "Duration",
      accessor: "start_date",
      cell: (_value: any, row: ExperienceType) => {
        const start = new Date(row.start_date).toLocaleDateString();
        const end = row.is_current ? "Present" : row.end_date ? new Date(row.end_date).toLocaleDateString() : "";
        return `${start} - ${end}`;
      }
    },
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
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">Manage your work experience</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search experience..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable<ExperienceType>
        data={experiences}
        columns={columns}
        onEdit={handleEdit}
        apiPath="experiences"
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
        enableSearch={false}
        showBorders={true}
      />

      <FormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editingExperience ? "Edit Experience" : "Add New Experience"}
        description={editingExperience ? "Update experience details" : "Add a new work experience"}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingExperience ? "Update" : "Create"}
        fields={experienceField}
      />
    </div>
  );
};

export default Experience;
