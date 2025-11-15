import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { toast } from "sonner";
import { apiService, MEDIA_URL } from "@/api/apiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, SkillFormData } from "@/schemas/skillSchema";
import { Skill } from "@/lib/types";
import { skillsField } from "@/components/shared/formFields";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

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

  // ✅ Fetch all skills
  const fetchSkills = useCallback(async () => {
    try {
      const data = await apiService.getAll("skills");
      setSkills(data);
    } catch {
      toast.error("Failed to load skills");
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // ✅ Submit (create or update)
  const handleSubmit = async (data: SkillFormData) => {
    try {
      const formData = new FormData();
      formData.append("skills", data.name);
      formData.append("media_alt", data.media_alt);
      formData.append("sort_order", data.sort_order.toString());
      formData.append("status", data.status ? "true" : "false");
      if (data.media_path instanceof File) formData.append("media_path", data.media_path);

      if (editingSkill) {
        const updatedSkill = await apiService.update("skills", editingSkill.id, formData);
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? updatedSkill : s))
        );
        toast.success("Skill updated successfully!");
      } else {
        const newSkill = await apiService.create("skills", formData, true);
        setSkills((prev) => [...prev, newSkill]);
        toast.success("Skill added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error("Failed to save skill. Please try again.");
    }
  };

  // ✅ Edit
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

  // ✅ Delete (UI-only update, no second API call)
  const handleDelete = (skill: Skill) => {
    setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    toast.success("Skill deleted successfully!");
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

      <DataTable<Skill>
        data={skills}
        columns={columns}
        onEdit={handleEdit}
        apiPath="skills"
        onDelete={handleDelete}
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
