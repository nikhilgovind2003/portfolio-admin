import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { technologySchema, TechnologyFormData } from "@/schemas/technologySchema";
import { Technology } from "@/lib/types";
import { technologyField } from "@/components/shared/formFields";
import { apiService } from "@/api/apiService";

const Technologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: "",
      sort_order: 1,
      status: true,
    },
  });

  // ✅ Fetch all technologies
  const fetchTechnologies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAll("technology");
      setTechnologies(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load technologies");
      setTechnologies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  // ✅ Create or Update
  const handleSubmit = async (data: TechnologyFormData) => {
    try {
      const payload = {
        name: data.name,
        sort_order: data.sort_order,
        status: data.status,
      };

      if (editingTech) {
        const updated = await apiService.update("technology", editingTech.id, payload);
        
        // Ensure updated object has all required fields
        if (updated && updated.id) {
          setTechnologies((prev) =>
            prev.map((t) => (t?.id === editingTech?.id ? updated : t))
          );
          toast.success("Technology updated successfully!");
        } else {
          // Fallback: refetch all data if response is incomplete
          await fetchTechnologies();
          toast.success("Technology updated successfully!");
        }
      } else {
        const created = await apiService.create("technology", payload);
        
        // Ensure created object has all required fields before adding to state
        if (created && created.id) {
          setTechnologies((prev) => [...prev, created]);
          toast.success("Technology created successfully!");
        } else {
          // Fallback: refetch all data if response is incomplete
          await fetchTechnologies();
          toast.success("Technology created successfully!");
        }
      }

      setIsDialogOpen(false);
      resetForm();
      
    } catch (error) {
      console.error("Error saving technology:", error);
      toast.error("Failed to save technology");
    }
  };

  // ✅ Edit tech
  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    form.reset({
      name: tech.name || "",
      sort_order: tech.sort_order || 1,
      status: tech.status ?? true,
    });
    setIsDialogOpen(true);
  };

  // ✅ Delete tech
  const handleDelete = async (tech: Technology) => {
    try {
      // await apiService.remove("technology", tech.id);
      setTechnologies((prev) => prev.filter((t) => t.id !== tech.id));
      toast.success("Technology deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete technology");
    }
  };

  // Reset Form
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

      <DataTable<Technology>
        data={technologies}
        columns={columns}
        onEdit={handleEdit}
        apiPath="technology"
        onDelete={handleDelete}
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