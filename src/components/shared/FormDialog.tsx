import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Switch } from "@/components/ui/switch";
import RichTextEditor from './RichTextEditor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEDIA_URL } from '@/api/apiService';

export type FormFieldType = 'text' | 'email' | 'date' | 'password' | 'textarea' | 'select' | 'number' | 'url' | 'file' | "switch" | 'multiselect' | 'richText';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  accept?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  rows?: number;
  showIf?: (values: any) => boolean;
}

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
  fields: FormFieldConfig[];
}

export const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  form,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  fields
}: FormDialogProps) => {
  const values = form.watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              {fields.map((field) => {
                if (field.showIf && !field.showIf(values)) return null;

                return (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          {field.type === 'file' ? (
                            <>
                              <Input
                                type="file"
                                accept={field.accept || 'image/*'}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  formField.onChange(file); // store File object
                                }}
                              />

                              {/* ✅ Safe preview handling for both new File and existing URL */}
                              {formField.value && (
                                <div className="mt-2">
                                  {formField.value instanceof File ? (
                                    <img
                                      src={URL.createObjectURL(formField.value)}
                                      alt="Preview"
                                      className="w-24 h-24 object-cover rounded"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        typeof formField.value === 'string'
                                          ? formField.value.startsWith('http')
                                            ? formField.value
                                          : `${MEDIA_URL}${formField.value}`
                                          : ''
                                      }
                                      alt="Preview"
                                      className="w-24 h-24 object-cover rounded"
                                    />
                                  )}
                                </div>
                              )}
                            </>
                          ) :
                            field.type === "multiselect" && field.options ? (
                              <div className="space-y-3">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className="w-full justify-between font-normal"
                                    >
                                      {formField.value?.length > 0
                                        ? `${formField.value.length} selected`
                                        : field.placeholder}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder={`Search ${field.label.toLowerCase()}...`} />
                                      <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup>
                                          {field.options.map((option) => (
                                            <CommandItem
                                              key={option.value}
                                              value={option.label}
                                              onSelect={() => {
                                                const current = formField.value || [];
                                                const updated = current.includes(option.value)
                                                  ? current.filter((v: string) => v !== option.value)
                                                  : [...current, option.value];
                                                formField.onChange(updated);
                                              }}
                                              className="flex items-center gap-2 cursor-pointer"
                                            >
                                              <Checkbox 
                                                checked={formField.value?.includes(option.value)}
                                                onCheckedChange={() => {}} // Handled by CommandItem onSelect
                                              />
                                              {option.label}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>

                                {/* Selected items as badges */}
                                <div className="flex flex-wrap gap-2">
                                  {formField.value?.map((v: string) => {
                                    const opt = field.options!.find((o) => o.value === v);
                                    return (
                                      <Badge
                                        key={v}
                                        variant="secondary"
                                        className="py-1 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1 group transition-colors"
                                      >
                                        {opt?.label}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            formField.onChange(
                                              formField.value.filter((x: string) => x !== v)
                                            )
                                          }
                                          className="text-blue-500 hover:text-red-500 transition-colors"
                                        >
                                          <X size={14} />
                                        </button>
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            ) :

                            // type === date
                            field.type === 'date' ? (
                              <Input
                                type="date"
                                placeholder={field.placeholder}
                                {...formField}
                              />
                            ) :

                              field.type === 'textarea' ? (
                                <Textarea
                                  placeholder={field.placeholder}
                                  rows={field.rows || 4}
                                  {...formField}
                                />
                              ) : field.type === 'richText' ? (
                                <RichTextEditor
                                  placeholder={field.placeholder}
                                  value={formField.value}
                                  onChange={formField.onChange}
                                />
                              ) : field.type === 'select' && field.options ? (
                                <Select onValueChange={formField.onChange} value={formField.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.type === 'switch' ? ( // ✅ handle switch input
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={formField.value}
                                    onCheckedChange={formField.onChange}
                                  />
                                  <span>{formField.value ? 'Active' : 'Inactive'}</span>
                                </div>
                              ) : (
                                <Input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  {...formField}
                                />
                              )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
