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



export const cmsDataField: FormFieldConfig[] = [
  { name: "super_title", label: "Super Title", type: "text", placeholder: "Enter super title" },
  { name: "title", label: "Title", type: "text", placeholder: "Enter title" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter description" },
  
  { name: "btn_one_text", label: "Button One Text", type: "text", placeholder: "Button text" },
  { name: "btn_one_link", label: "Button One Link", type: "text", placeholder: "Button link URL" },
  
  { name: "btn_two_text", label: "Button Two Text", type: "text", placeholder: "Button text" },
  { name: "btn_two_link", label: "Button Two Link", type: "text", placeholder: "Button link URL" },
  
  { name: "media_path", label: "Media File / URL", type: "file", placeholder: "Upload media or provide URL" },
  { name: "media_alt", label: "Media Alt Text", type: "text", placeholder: "Alt text for media" },
  
  { name: "project_title", label: "Project Title", type: "text", placeholder: "Enter project title" },
  { name: "skills_title", label: "Skills Title", type: "text", placeholder: "Enter skills title" },
  
  { name: "about_title", label: "About Title", type: "text", placeholder: "Enter about section title" },
  { name: "about_description", label: "About Description", type: "textarea", placeholder: "Enter about description" },
  
  { name: "contact_title", label: "Contact Title", type: "text", placeholder: "Enter contact section title" },
];