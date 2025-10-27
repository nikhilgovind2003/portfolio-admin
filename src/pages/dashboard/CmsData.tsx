import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CmsEntry {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
}

const CmsData = () => {
  const [entries, setEntries] = useState<CmsEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CmsEntry | null>(null);
  const [formData, setFormData] = useState({ title: '', type: '', content: '' });

  const columns = [
    { header: 'Title', accessor: 'title' as keyof CmsEntry },
    { header: 'Type', accessor: 'type' as keyof CmsEntry },
    { 
      header: 'Content', 
      accessor: 'content' as keyof CmsEntry,
      cell: (value: string) => (
        <div className="max-w-md truncate">{value}</div>
      )
    },
    { 
      header: 'Created', 
      accessor: 'createdAt' as keyof CmsEntry,
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...formData, id: editingEntry.id, createdAt: editingEntry.createdAt } 
          : entry
      ));
      toast.success('Entry updated successfully');
    } else {
      setEntries([...entries, { 
        ...formData, 
        id: crypto.randomUUID(), 
        createdAt: new Date().toISOString() 
      }]);
      toast.success('Entry created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (entry: CmsEntry) => {
    setEditingEntry(entry);
    setFormData({ title: entry.title, type: entry.type, content: entry.content });
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: CmsEntry) => {
    setEntries(entries.filter(e => e.id !== entry.id));
    toast.success('Entry deleted successfully');
  };

  const resetForm = () => {
    setFormData({ title: '', type: '', content: '' });
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CMS Data</h1>
          <p className="text-muted-foreground">Manage your content entries</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <DataTable
        data={entries}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
            <DialogDescription>
              {editingEntry ? 'Update CMS entry' : 'Create a new content entry'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Blog Post, Page, Article"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEntry ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CmsData;
