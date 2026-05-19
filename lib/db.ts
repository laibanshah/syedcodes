"use server";

import { supabase, supabaseAdmin, Project, Service, AboutSection, ContactLink, Setting } from './supabase';
import { revalidatePath } from 'next/cache';

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/');
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
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  revalidatePath('/');
}

// SERVICES
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('about_section')
    .select('*')
    .single();
  
  if (error) {
    // If no about section exists, return null
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function updateAboutSection(about: Partial<Omit<AboutSection, 'id' | 'updated_at'>>): Promise<AboutSection> {
  // First check if about section exists
  const existing = await getAboutSection();
  
  if (existing) {
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
  const { data, error } = await supabase
    .from('contact_links')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getContactLinkById(id: string): Promise<ContactLink | null> {
  const { data, error } = await supabase
    .from('contact_links')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getAllSettings(): Promise<Setting[]> {
  const { data, error } = await supabase
    .from('settings')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

export async function updateSetting(key: string, value: any): Promise<Setting> {
  const existing = await getSetting(key);
  
  if (existing) {
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
