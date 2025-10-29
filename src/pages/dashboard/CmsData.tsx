import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { apiService } from '@/api/apiService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cmsSchema, CmsFormData } from '@/schemas/cmsSchema';

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
  const [isExisting, setIsExisting] = useState(false);

  const form = useForm<CmsFormData>({
    resolver: zodResolver(cmsSchema),
    defaultValues: {
      title: '',
      slug: '',
      type: 'page',
      status: 'draft',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const data = await apiService.getAll('cms');
        if (data.length > 0) {
          form.reset(data[0]);
          setIsExisting(true);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch CMS data');
      }
    };
    fetchCmsData();
  }, []);

  const handleSubmit = async (data: CmsFormData) => {
    try {
      const formDataWithId = form.getValues() as CmsEntry;
      if (isExisting && formDataWithId._id) {
        await apiService.update('cms', formDataWithId._id, data);
        toast.success('CMS entry updated successfully');
      } else {
        await apiService.create('cms', data);
        toast.success('CMS entry created successfully');
        setIsExisting(true);
      }
    } catch (err) {
      toast.error('Failed to save CMS entry');
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input placeholder="url-friendly-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="page">Page</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="section">Section</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title (SEO)</FormLabel>
                <FormControl>
                  <Input maxLength={60} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description (SEO)</FormLabel>
                <FormControl>
                  <Textarea maxLength={160} rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : isExisting ? 'Update CMS Entry' : 'Create CMS Entry'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CmsData;
