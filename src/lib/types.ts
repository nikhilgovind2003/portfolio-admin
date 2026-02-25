export type Skill = {
  id?: number | string;
  _id?: string;
  skills: string;
  name: string;
  media_path?: string;
  media_alt?: string;
  status: boolean;
  sort_order: number;
};

export type Project = {
  id?: number | string;
  _id?: string;
  title: string;
  description: string;
  technology_ids: string[];
  media_path?: string | File;
  media_alt?: string;
  project_link?: string;
  github_link?: string;
  status: boolean;
  sort_order: number;
  technologies_list?: Technology[];
};


export type Technology = {
  id?: string;
  _id?: string;
  name: string;
  status: boolean;
  sort_order: number;
}


export type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  message: string;
}

export type CMS = {
  id?: string;
  _id?: string;
  project_title?: string;
  skills_title?: string;
  about_title?: string;
  about_description?: string;
  contact_title?: string;
  resume?: string;
  media_path?: string;
  media_alt?: string;
  super_title?: string;
  title?: string;
  description?: string;
  btn_one_text?: string;
  btn_one_link?: string;
  btn_two_text?: string;
  experience_title?: string;
  // Add other fields as needed
};

export type Experience = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  media_path?: string;
  media_alt?: string;
  status: boolean;
  sort_order: number;
};
