import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Technology {
  id: string;
  name: string;
  category: string;
  projectCount: number;
}

const Technologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '' });

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Technology },
    { header: 'Category', accessor: 'category' as keyof Technology },
    { 
      header: 'Projects', 
      accessor: 'projectCount' as keyof Technology,
      cell: (value: number) => <span className="text-muted-foreground">{value} projects</span>
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTech) {
      setTechnologies(technologies.map(t => 
        t.id === editingTech.id 
          ? { ...formData, id: editingTech.id, projectCount: editingTech.projectCount } 
          : t
      ));
      toast.success('Technology updated successfully');
    } else {
      setTechnologies([...technologies, { ...formData, id: crypto.randomUUID(), projectCount: 0 }]);
      toast.success('Technology created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    setFormData({ name: tech.name, category: tech.category });
    setIsDialogOpen(true);
  };

  const handleDelete = (tech: Technology) => {
    setTechnologies(technologies.filter(t => t.id !== tech.id));
    toast.success('Technology deleted successfully');
  };

  const resetForm = () => {
    setFormData({ name: '', category: '' });
    setEditingTech(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technologies</h1>
          <p className="text-muted-foreground">Manage technologies in your stack</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Technology
        </Button>
      </div>

      <DataTable
        data={technologies}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTech ? 'Edit Technology' : 'Add New Technology'}</DialogTitle>
            <DialogDescription>
              {editingTech ? 'Update technology information' : 'Add a new technology to your stack'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Technology Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Framework, Library, Tool"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTech ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Technologies;
