"use server";

import { supabase, supabaseAdmin, Project, Service, AboutSection, ContactLink, Setting } from './supabase';
import { revalidatePath } from 'next/cache';

// FALLBACK PREVIEWS (Used if Supabase environment variables are missing or DB queries fail)
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-p1',
    title: 'Luxury Portfolio Template',
    description: 'A premium static site designed for luxury brands and high-end portfolios. Focuses on animations, clean lines, and responsive layouts.',
    link: 'https://github.com/laibanshah',
    image_url: null,
    tech_stack: ['Next.js', 'React', 'Framer Motion', 'TailwindCSS'],
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-p2',
    title: 'Cinematic Portfolio Experience',
    description: 'An interactive portfolio featuring full-screen cinematic backdrops, floating navigations, and fluid visual transitions.',
    link: 'https://github.com/laibanshah',
    image_url: null,
    tech_stack: ['Next.js', 'React', 'Framer Motion', 'Vanilla CSS'],
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const FALLBACK_ABOUT: AboutSection = {
  id: 'fallback-about',
  title: 'The Architect Behind the Code',
  content: 'I am a passionate web developer specializing in building premium, cinematic, and responsive static and dynamic websites. My client-focused approach ensures every pixel is perfect and every interaction feels professional.',
  updated_at: new Date().toISOString(),
};

const FALLBACK_SERVICES: Service[] = [
  {
    id: 'fallback-s1',
    title: 'Static Websites',
    description: 'Fast, secure, and beautiful static sites tailored for small businesses and personal portfolios.',
    icon_name: 'Globe',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-s2',
    title: 'Dynamic Web Apps',
    description: 'Complex, interactive web applications built with React and Next.js for scalable solutions.',
    icon_name: 'Monitor',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-s3',
    title: 'Admin Dashboards',
    description: 'Custom dashboards for managing data, users, and content with intuitive UI.',
    icon_name: 'Server',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-s4',
    title: 'Authentication Systems',
    description: 'Secure login, registration, and role-based access control for your applications.',
    icon_name: 'Lock',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-s5',
    title: 'Blogging Platforms',
    description: 'SEO-optimized, content-rich blogging systems with easy-to-use CMS integration.',
    icon_name: 'PenTool',
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-s6',
    title: 'Business Websites',
    description: 'Corporate websites designed to establish trust, generate leads, and showcase services.',
    icon_name: 'Briefcase',
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const FALLBACK_CONTACT_LINKS: ContactLink[] = [
  {
    id: 'fallback-c1',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/laiban-shah-394483408',
    icon_name: 'FaLinkedin',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-c2',
    platform: 'GitHub',
    url: 'https://github.com/laibanshah',
    icon_name: 'FaGithub',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-c3',
    platform: 'Instagram',
    url: 'https://www.instagram.com/syedcodes.ui/',
    icon_name: 'FaInstagram',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-c4',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@lantern_oflight',
    icon_name: 'FaYoutube',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-c5',
    platform: 'Email',
    url: 'mailto:lanternoflight11@gmail.com',
    icon_name: 'Mail',
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const FALLBACK_SETTINGS: Record<string, Setting> = {
  hero: {
    id: 'fallback-set1',
    key: 'hero',
    value: {
      title: "Welcome to SyedCodes.UI",
      subtitle: "Crafting luxury modern layouts, responsive web applications, and digital experiences that leave a lasting impression."
    },
    updated_at: new Date().toISOString(),
  },
  social_links: {
    id: 'fallback-set2',
    key: 'social_links',
    value: {
      linkedin: "https://www.linkedin.com/in/laiban-shah-394483408",
      github: "https://github.com/laibanshah",
      instagram: "https://www.instagram.com/syedcodes.ui/",
      youtube: "https://www.youtube.com/@lantern_oflight"
    },
    updated_at: new Date().toISOString(),
  }
};

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error.message);
      return FALLBACK_PROJECTS;
    }
    return data || FALLBACK_PROJECTS;
  } catch (error) {
    console.error('Exception fetching projects:', error);
    return FALLBACK_PROJECTS;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching featured projects:', error.message);
      return FALLBACK_PROJECTS.filter(p => p.featured);
    }
    return data || FALLBACK_PROJECTS.filter(p => p.featured);
  } catch (error) {
    console.error('Exception fetching featured projects:', error);
    return FALLBACK_PROJECTS.filter(p => p.featured);
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching project ${id}:`, error.message);
      return FALLBACK_PROJECTS.find(p => p.id === id) || null;
    }
    return data;
  } catch (error) {
    console.error(`Exception fetching project ${id}:`, error);
    return FALLBACK_PROJECTS.find(p => p.id === id) || null;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/projects');
  return data;
}

export async function updateProject(id: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ ...project, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/projects');
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/projects');
}

// SERVICES
export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error.message);
      return FALLBACK_SERVICES;
    }
    return data || FALLBACK_SERVICES;
  } catch (error) {
    console.error('Exception fetching services:', error);
    return FALLBACK_SERVICES;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching service ${id}:`, error.message);
      return FALLBACK_SERVICES.find(s => s.id === id) || null;
    }
    return data;
  } catch (error) {
    console.error(`Exception fetching service ${id}:`, error);
    return FALLBACK_SERVICES.find(s => s.id === id) || null;
  }
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .insert(service)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
  return data;
}

export async function updateService(id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<Service> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .update({ ...service, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  revalidatePath('/');
}

// ABOUT SECTION
export async function getAboutSection(): Promise<AboutSection | null> {
  try {
    const { data, error } = await supabase
      .from('about_section')
      .select('*')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching about section:', error.message);
      return FALLBACK_ABOUT;
    }
    return data;
  } catch (error) {
    console.error('Exception fetching about section:', error);
    return FALLBACK_ABOUT;
  }
}

export async function updateAboutSection(about: Partial<Omit<AboutSection, 'id' | 'updated_at'>>): Promise<AboutSection> {
  const existing = await getAboutSection();
  
  if (existing && existing.id !== 'fallback-about') {
    const { data, error } = await supabaseAdmin
      .from('about_section')
      .update({ ...about, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/');
    return data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('about_section')
      .insert(about)
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/');
    return data;
  }
}

// CONTACT LINKS
export async function getContactLinks(): Promise<ContactLink[]> {
  try {
    const { data, error } = await supabase
      .from('contact_links')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching contact links:', error.message);
      return FALLBACK_CONTACT_LINKS;
    }
    return data || FALLBACK_CONTACT_LINKS;
  } catch (error) {
    console.error('Exception fetching contact links:', error);
    return FALLBACK_CONTACT_LINKS;
  }
}

export async function getContactLinkById(id: string): Promise<ContactLink | null> {
  try {
    const { data, error } = await supabase
      .from('contact_links')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching contact link ${id}:`, error.message);
      return FALLBACK_CONTACT_LINKS.find(c => c.id === id) || null;
    }
    return data;
  } catch (error) {
    console.error(`Exception fetching contact link ${id}:`, error);
    return FALLBACK_CONTACT_LINKS.find(c => c.id === id) || null;
  }
}

export async function createContactLink(link: Omit<ContactLink, 'id' | 'created_at' | 'updated_at'>): Promise<ContactLink> {
  const { data, error } = await supabaseAdmin
    .from('contact_links')
    .insert(link)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
  return data;
}

export async function updateContactLink(id: string, link: Partial<Omit<ContactLink, 'id' | 'created_at' | 'updated_at'>>): Promise<ContactLink> {
  const { data, error } = await supabaseAdmin
    .from('contact_links')
    .update({ ...link, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
  return data;
}

export async function deleteContactLink(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('contact_links')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  revalidatePath('/');
}

// SETTINGS
export async function getSetting(key: string): Promise<Setting | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error(`Error fetching setting ${key}:`, error.message);
      return FALLBACK_SETTINGS[key] || null;
    }
    return data;
  } catch (error) {
    console.error(`Exception fetching setting ${key}:`, error);
    return FALLBACK_SETTINGS[key] || null;
  }
}

export async function getAllSettings(): Promise<Setting[]> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) {
      console.error('Error fetching all settings:', error.message);
      return Object.values(FALLBACK_SETTINGS);
    }
    return data || Object.values(FALLBACK_SETTINGS);
  } catch (error) {
    console.error('Exception fetching all settings:', error);
    return Object.values(FALLBACK_SETTINGS);
  }
}

export async function updateSetting(key: string, value: any): Promise<Setting> {
  const existing = await getSetting(key);
  
  if (existing && existing.id !== 'fallback-set1' && existing.id !== 'fallback-set2') {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/');
    return data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .insert({ key, value })
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/');
    return data;
  }
}

// IMAGE UPLOAD
export async function uploadProjectImage(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;
  if (!file || !projectId) throw new Error('Missing file or projectId');

  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from('project-images')
    .upload(filePath, buffer, {
      contentType: file.type,
      duplex: 'half'
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('project-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProjectImage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    const { error } = await supabaseAdmin.storage
      .from('project-images')
      .remove([fileName]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}
