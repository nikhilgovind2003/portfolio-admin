import { FormFieldConfig } from "./FormDialog";

export const skillsField: FormFieldConfig[] = [
  { name: "name", label: "Skill Name", type: "text", placeholder: "React" },
  { name: "media_path", label: "Skill Image", type: "file", accept: "image/*" },
  { name: "media_alt", label: "Alt Text", type: "text", placeholder: "Alt text" },
  { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { name: "status", label: "Status", type: "switch" },
];


export const projectField: FormFieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Project name' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed description...', rows: 4 },
 { name: 'technology_ids', label: 'Technologies', type: 'multiselect', placeholder: 'Select technologies' },
  { name: 'media_path', label: 'Media Path', type: 'file', accept: '/images/*' },
  { name: "media_alt", label: "Alt Text", type: "text", placeholder: "Alt text" },
  { name: 'project_link', label: 'Project Link', type: 'url', placeholder: 'https://example.com' },
  { name: 'github_link', label: 'GitHub Link', type: 'url', placeholder: 'https://github.com/username/repo' },
];

export const technologyField: FormFieldConfig[] = [
  { name: 'name', label: 'Technology Name', type: 'text', placeholder: 'React' },
  { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { name: "status", label: "Status", type: "switch" },
];