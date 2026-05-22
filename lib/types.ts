export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image_url: string | null;
  tech_stack: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  title: string | null;
  content: string | null;
  updated_at: string;
}

export interface ContactLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}
