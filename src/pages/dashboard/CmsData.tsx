import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { apiService, MEDIA_URL } from '@/api/apiService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsFormData, cmsSchema } from '@/schemas/cmsSchema';
import { Loader2 } from 'lucide-react';


const CmsData = () => {
  const [isExisting, setIsExisting] = useState(false);
  const [cmsId, setCmsId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string>("");

  const form = useForm<CmsFormData>({
    resolver: zodResolver(cmsSchema),
    defaultValues: {
      super_title: '',
      title: '',
      description: '',
      btn_one_text: '',
      btn_one_link: '',
      btn_two_text: '',
      btn_two_link: '',
      media_path: '',
      media_alt: '',
      project_title: '',
      skills_title: '',
      about_title: '',
      about_description: '',
      contact_title: '',
    },
  });

  const fetchCmsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAll('cms');
      
      // Handle both direct data and nested data structure
      const data = response?.data || response;
      
      if (data && (data.id || data.length > 0)) {
        const cmsData = Array.isArray(data) ? data[0] : data;
        
        form.reset({
          super_title: cmsData.super_title || '',
          title: cmsData.title || '',
          description: cmsData.description || '',
          btn_one_text: cmsData.btn_one_text || '',
          btn_one_link: cmsData.btn_one_link || '',
          btn_two_text: cmsData.btn_two_text || '',
          btn_two_link: cmsData.btn_two_link || '',
          media_path: cmsData.media_path || '',
          media_alt: cmsData.media_alt || '',
          project_title: cmsData.project_title || '',
          skills_title: cmsData.skills_title || '',
          about_title: cmsData.about_title || '',
          about_description: cmsData.about_description || '',
          contact_title: cmsData.contact_title || '',
        });
        
        setCmsId(cmsData.id);
        setCurrentImage(cmsData.media_path || '');
        setIsExisting(true);
      }
    } catch (err) {
      console.error('Error fetching CMS data:', err);
      toast.error('Failed to fetch CMS data');
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  const handleSubmit = async (data: CmsFormData) => {
    try {
      const formData = new FormData();
      formData.append('super_title', data.super_title);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('btn_one_text', data.btn_one_text);
      formData.append('btn_one_link', data.btn_one_link);
      formData.append('btn_two_text', data.btn_two_text);
      formData.append('btn_two_link', data.btn_two_link);
      formData.append('media_alt', data.media_alt);
      formData.append('project_title', data.project_title);
      formData.append('skills_title', data.skills_title);
      formData.append('about_title', data.about_title);
      formData.append('about_description', data.about_description);
      formData.append('contact_title', data.contact_title);

      if (data.media_path instanceof File) {
        formData.append('media_path', data.media_path);
      }

      if (isExisting && cmsId) {
        const updated = await apiService.update('cms', cmsId, formData);
        
        if (updated && (updated.id || updated.data?.id)) {
          const updatedData = updated.data || updated;
          setCurrentImage(updatedData.media_path || '');
          toast.success('CMS entry updated successfully');
        } else {
          // Fallback: refetch data
          await fetchCmsData();
          toast.success('CMS entry updated successfully');
        }
      } else {
        const created = await apiService.create('cms', formData, true);
        
        if (created && (created.id || created.data?.id)) {
          const createdData = created.data || created;
          setCmsId(createdData.id);
          setCurrentImage(createdData.media_path || '');
          setIsExisting(true);
          toast.success('CMS entry created successfully');
        } else {
          // Fallback: refetch data
          await fetchCmsData();
          toast.success('CMS entry created successfully');
        }
      }
    } catch (err) {
      console.error('Error saving CMS data:', err);
      toast.error('Failed to save CMS entry');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">CMS Data</h1>
        <p className="text-muted-foreground">
          {isExisting ? 'Update your website content' : 'Create your website content'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Hero Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Hero Section</h2>
            
            <FormField
              control={form.control}
              name="super_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Super Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Welcome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your main headline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Your introduction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="btn_one_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button 1 Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., View Projects" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="btn_one_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button 1 Link</FormLabel>
                    <FormControl>
                      <Input placeholder="/projects" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="btn_two_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button 2 Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Contact Me" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="btn_two_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button 2 Link</FormLabel>
                    <FormControl>
                      <Input placeholder="/contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="media_path"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {currentImage && (
                <div className="mt-2">
                  <img
                    src={`${MEDIA_URL}${currentImage}`}
                    alt="Current hero image"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="media_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the image for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section Titles */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Section Titles</h2>

            <FormField
              control={form.control}
              name="project_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Featured Projects" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technical Skills" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., About Me" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Let's Build Something Amazing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* About Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">About Section</h2>

            <FormField
              control={form.control}
              name="about_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Tell visitors about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isExisting ? 'Update CMS Content' : 'Create CMS Content'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CmsData;