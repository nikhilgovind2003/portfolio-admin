import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { technologySchema, TechnologyFormData } from "@/schemas/technologySchema";
import { Technology } from "@/lib/types";
import { technologyField } from "@/components/shared/formFields";
import { apiService } from "@/api/apiService";
import { PaginationInfo } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";

const Technologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // PAGINATION & SEARCH STATES
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

  const form = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: "",
      sort_order: 1,
      status: true,
    },
  });

  // Fetch technologies with pagination and search
  const fetchTechnologies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAll("technology", {
        page: currentPage,
        limit: limit,
        search: searchQuery,
      });
      setTechnologies(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load technologies");
      setTechnologies([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchQuery]);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  // PAGE CHANGE HANDLER
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // LIMIT CHANGE HANDLER
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // SEARCH HANDLER
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Create or Update Submit
  const handleSubmit = async (data: TechnologyFormData) => {
    try {
      const payload = {
        name: data.name,
        sort_order: data.sort_order,
        status: data.status,
      };

      if (editingTech) {
        const updated = await apiService.update("technology", editingTech.id, payload);
        if (updated && updated.id) {
          setTechnologies((prev) =>
            prev.map((t) => (t?.id === editingTech?.id ? updated : t))
          );
          toast.success("Technology updated successfully!");
        } else {
          await fetchTechnologies();
          toast.success("Technology updated successfully!");
        }
      } else {
        const created = await apiService.create("technology", payload);
        if (created && created.id) {
          setTechnologies((prev) => [...prev, created]);
          toast.success("Technology created successfully!");
        } else {
          await fetchTechnologies();
          toast.success("Technology created successfully!");
        }
      }

      // Refetch to ensure paginated data is fresh
      await fetchTechnologies();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving technology:", error);
      toast.error("Failed to save technology");
    }
  };

  // Edit tech handler
  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    form.reset({
      name: tech.name || "",
      sort_order: tech.sort_order || 1,
      status: tech.status ?? true,
    });
    setIsDialogOpen(true);
  };

  // Delete tech handler (calls API and refetches)
  const handleDelete = async (tech: Technology) => {
    try {
      // await apiService.remove("technology", tech.id);
      // toast.success("Technology deleted successfully!");
      await fetchTechnologies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete technology");
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      sort_order: 1,
      status: true,
    });
    setEditingTech(null);
  };

  const columns = [
    { 
      header: "Name", 
      accessor: "name",
      cell: (value: string) => value || "N/A"
    },
    { 
      header: "Sort Order", 
      accessor: "sort_order",
      cell: (value: number) => value ?? "N/A"
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
    { 
      header: "Created At", 
      accessor: "updatedAt", 
      cell: (value: string) => {
        try {
          return value ? new Date(value).toLocaleDateString("en-IN") : "N/A";
        } catch {
          return "Invalid Date";
        }
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technologies</h1>
          <p className="text-muted-foreground">Manage your technologies</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Technology
        </Button>
      </div>
      
      {/* SEARCH BAR */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* PAGINATION & LIMIT PROPS passed to DataTable */}
      <DataTable<Technology>
        data={technologies}
        columns={columns}
        onEdit={handleEdit}
        apiPath="technology"
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
        title={editingTech ? "Edit Technology" : "Add New Technology"}
        description={
          editingTech
            ? "Update technology details"
            : "Add a new technology to your stack"
        }
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingTech ? "Update" : "Create"}
        fields={technologyField}
      />
    </div>
  );
};

export default Technologies;
