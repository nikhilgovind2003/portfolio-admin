import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { apiService } from '@/api/apiService';

interface CmsEntry {
  _id?: string;
  title: string;
  slug: string;
  type: 'page' | 'post' | 'article' | 'section';
  status: 'draft' | 'published' | 'archived';
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
}

const CmsData = () => {
  const [formData, setFormData] = useState<CmsEntry>({
    title: '',
    slug: '',
    type: 'page',
    status: 'draft',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  // ✅ Load the CMS entry (if editing existing content)
  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const data = await apiService.getAll('cms'); // or getOne('cms', id)
        if (data.length > 0) {
          setFormData(data[0]); // assume one active CMS record
          setIsExisting(true);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch CMS data');
      }
    };
    fetchCmsData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isExisting && formData._id) {
        await apiService.update('cms', formData._id, formData);
        toast.success('CMS entry updated successfully');
      } else {
        await apiService.create('cms', formData);
        toast.success('CMS entry created successfully');
        setIsExisting(true);
      }
    } catch (err) {
      toast.error('Failed to save CMS entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">CMS Data</h1>
        <p className="text-muted-foreground">
          {isExisting ? 'Update your existing CMS entry' : 'Create a new CMS entry'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as CmsEntry['type'] })}
            >
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as CmsEntry['status'] })}
            >
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
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
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            maxLength={160}
            rows={2}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isExisting ? 'Update CMS Entry' : 'Create CMS Entry'}
        </Button>
      </form>
    </div>
  );
};

export default CmsData;
