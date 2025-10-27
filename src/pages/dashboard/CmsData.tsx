import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog } from '@/components/shared/FormDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CmsEntry {
  id: string;
  title: string;
  slug: string;
  type: 'page' | 'post' | 'article' | 'section';
  status: 'draft' | 'published' | 'archived';
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

const CmsData = () => {
  const [entries, setEntries] = useState<CmsEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CmsEntry | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'post' as CmsEntry['type'],
    status: 'draft' as CmsEntry['status'],
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: ''
  });

  const columns = [
    { header: 'Title', accessor: 'title' as keyof CmsEntry },
    { header: 'Slug', accessor: 'slug' as keyof CmsEntry },
    { 
      header: 'Type', 
      accessor: 'type' as keyof CmsEntry,
      cell: (value: string) => (
        <span className="capitalize px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{value}</span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof CmsEntry,
      cell: (value: string) => {
        const statusColors = {
          draft: 'bg-muted text-muted-foreground',
          published: 'bg-success/10 text-success',
          archived: 'bg-destructive/10 text-destructive'
        };
        return (
          <span className={`capitalize px-2 py-1 rounded-full text-xs ${statusColors[value as keyof typeof statusColors]}`}>
            {value}
          </span>
        );
      }
    },
    { 
      header: 'Excerpt', 
      accessor: 'excerpt' as keyof CmsEntry,
      cell: (value: string) => (
        <div className="max-w-xs truncate text-muted-foreground text-sm">{value}</div>
      )
    },
    { 
      header: 'Updated', 
      accessor: 'updatedAt' as keyof CmsEntry,
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    if (editingEntry) {
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...formData, id: editingEntry.id, createdAt: editingEntry.createdAt, updatedAt: now } 
          : entry
      ));
      toast.success('Entry updated successfully');
    } else {
      setEntries([...entries, { 
        ...formData, 
        id: crypto.randomUUID(), 
        createdAt: now,
        updatedAt: now
      }]);
      toast.success('Entry created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (entry: CmsEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      slug: entry.slug,
      type: entry.type,
      status: entry.status,
      content: entry.content,
      excerpt: entry.excerpt,
      metaTitle: entry.metaTitle,
      metaDescription: entry.metaDescription
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: CmsEntry) => {
    setEntries(entries.filter(e => e.id !== entry.id));
    toast.success('Entry deleted successfully');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      type: 'post',
      status: 'draft',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: ''
    });
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

      <FormDialog
        open={isDialogOpen}
        onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}
        title={editingEntry ? 'Edit Entry' : 'Add New Entry'}
        description={editingEntry ? 'Update CMS entry details' : 'Create a new content entry'}
        onSubmit={handleSubmit}
        onCancel={() => { setIsDialogOpen(false); resetForm(); }}
        submitLabel={editingEntry ? 'Update' : 'Create'}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="url-friendly-slug"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as CmsEntry['type'] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="section">Section</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as CmsEntry['status'] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief description"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Full content"
            required
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            placeholder="SEO title (60 chars max)"
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            placeholder="SEO description (160 chars max)"
            maxLength={160}
            rows={2}
          />
        </div>
      </FormDialog>
    </div>
  );
};

export default CmsData;
