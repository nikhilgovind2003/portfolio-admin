import { FormFieldConfig } from "./FormDialog";

export const formFields: FormFieldConfig[] = [
  { name: "name", label: "Skill Name", type: "text", placeholder: "React" },
  { name: "media_path", label: "Skill Image", type: "file", accept: "image/*" },
  { name: "media_alt", label: "Alt Text", type: "text", placeholder: "Alt text" },
  { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { name: "status", label: "Status", type: "switch" },
];
