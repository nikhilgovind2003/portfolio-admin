export type Skill = {
  id: number;
  skills: string;
  name: string;
  media_path?: string;
  media_alt?: string;
  status: boolean;
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  technology_ids: (string | number)[];
  media_path?: string | File;
  media_alt?: string;
  project_link?: string;
  github_link?: string;
  status: boolean;
  sort_order: number;
};


export type Technology = {
  id: string;
  name: string;
  status: boolean;
  sort_order: number;
}


export type User = {
  id: string;
  name: string;
  email: string;
  message: string;
}

export type CMS = {
  project_title?: string;
  skills_title?: string;
  about_title?: string;
  about_description?: string;
  contact_title?: string;
  // Add other fields as needed
};


