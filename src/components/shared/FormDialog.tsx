import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Switch } from "@/components/ui/switch";

export type FormFieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'url' | 'file' | "switch" | 'multiselect';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  accept?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  rows?: number;
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
              {fields.map((field) => (
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
                                          : `http://localhost:4000${formField.value}`
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
                            <div className="space-y-2">

                              {/* Dropdown */}
                              <Select
                                onValueChange={(value) => {
                                  const current = formField.value || [];

                                  const updated = current.includes(value)
                                    ? current.filter((v: string) => v !== value)
                                    : [...current, value];

                                  formField.onChange(updated);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>

                                <SelectContent>
                                  {field.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {formField.value?.includes(option.value) ? "☑ " : "⬜ "}
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {/* Show selected chips */}
                              <div className="flex flex-wrap gap-2">
                                {formField.value?.map((v: string) => {
                                  const opt = field.options!.find((o) => o.value === v);
                                  return (
                                    <div
                                      key={v}
                                      className="px-3 py-1 rounded-full bg-gray-100 border text-sm flex items-center gap-1"
                                    >
                                      {opt?.label}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          formField.onChange(
                                            formField.value.filter((x: string) => x !== v)
                                          )
                                        }
                                        className="text-red-500 font-bold"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) :

                            field.type === 'textarea' ? (
                              <Textarea
                                placeholder={field.placeholder}
                                rows={field.rows || 4}
                                {...formField}
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
              ))}
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
