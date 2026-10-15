import fs from 'fs';
import path from 'path';
import {
  ClinicSettings,
  OpeningHour,
  Service,
  GalleryImage,
  Appointment,
  ContactMessage,
  AdminActivityLog,
  Testimonial,
} from '@/types/clinic';
import {
  initialClinicSettings,
  initialOpeningHours,
  initialServices,
  initialGalleryImages,
  initialTestimonials,
} from '@/lib/defaultData';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface StoredData {
  settings: ClinicSettings;
  draftSettings?: ClinicSettings;
  openingHours: OpeningHour[];
  services: Service[];
  galleryImages: GalleryImage[];
  appointments: Appointment[];
  contactMessages: ContactMessage[];
  activityLogs: AdminActivityLog[];
  testimonials: Testimonial[];
  adminCredentials?: {
    email: string;
    password: string;
  };
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'clinic_data.json');

// Ensure local persistence file exists
function getLocalData(): StoredData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const defaultState: StoredData = {
        settings: initialClinicSettings,
        draftSettings: undefined,
        openingHours: initialOpeningHours,
        services: initialServices,
        galleryImages: initialGalleryImages,
        appointments: [
          {
            id: 'apt-seed-1',
            patient_name: 'Zubair Khan',
            phone: '0300 1234567',
            email: 'zubair.khan@example.com',
            requested_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            requested_time: '14:30',
            service_id: 's-3',
            service_title: 'Teeth Cleaning',
            notes: 'Need routine scaling & polishing before weekend.',
            status: 'confirmed',
            consent_given: true,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'apt-seed-2',
            patient_name: 'Fatima Noor',
            phone: '0312 9876543',
            email: 'fatima.noor@example.com',
            requested_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            requested_time: '18:00',
            service_id: 's-4',
            service_title: 'Root Canal Treatment',
            notes: 'Severe pain on lower right molar. Urgent attention needed.',
            status: 'pending',
            consent_given: true,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
        ],
        contactMessages: [
          {
            id: 'msg-seed-1',
            name: 'Hamza Tariq',
            contact_info: '0321 5556677',
            subject: 'Orthodontic / Braces Inquiry',
            message: 'Hello, do you provide invisible aligners or ceramic braces? What is the consultation process?',
            is_read: false,
            is_archived: false,
            created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
          },
        ],
        activityLogs: [
          {
            id: 'log-seed-1',
            action: 'System Initialized',
            details: 'Dynasty Dental Solutions portal initialized with initial clinic data.',
            admin_user: 'system@dynastydental.pk',
            timestamp: new Date().toISOString(),
          },
        ],
        testimonials: initialTestimonials,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2), 'utf-8');
      return defaultState;
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local data file:', err);
    return {
      settings: initialClinicSettings,
      openingHours: initialOpeningHours,
      services: initialServices,
      galleryImages: initialGalleryImages,
      appointments: [],
      contactMessages: [],
      activityLogs: [],
      testimonials: initialTestimonials,
    };
  }
}

function saveLocalData(data: StoredData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local data file:', err);
  }
}

// ----------------- Admin Credentials Store -----------------

export function getStoredAdminCredentials(): { email: string; password: string } {
  const local = getLocalData();
  if (local.adminCredentials && local.adminCredentials.email && local.adminCredentials.password) {
    return local.adminCredentials;
  }
  return {
    email: 'owner@dynastydental.pk',
    password: process.env.ADMIN_PASSWORD || 'Dynasty2025!Dental',
  };
}

export function updateStoredAdminCredentials(newEmail: string, newPassword: string): void {
  const local = getLocalData();
  const cleanEmail = newEmail.trim().toLowerCase();
  local.adminCredentials = {
    email: cleanEmail,
    password: newPassword,
  };
  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Credentials Updated',
    details: `Owner account credentials updated. Admin email: ${cleanEmail}.`,
    admin_user: cleanEmail,
    timestamp: new Date().toISOString(),
  });
  saveLocalData(local);
}

// ----------------- Public & Admin Data Accessors -----------------

export async function getClinicSettings(previewDraft: boolean = false): Promise<ClinicSettings> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('clinic_settings')
        .select('*')
        .eq('id', 'dynasty-settings-1')
        .single();

      if (!error && data) {
        if (previewDraft && data.has_draft_changes && data.draft_data) {
          return { ...data, ...data.draft_data };
        }
        return data as ClinicSettings;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local data:', err);
    }
  }

  const local = getLocalData();
  if (previewDraft && local.settings.has_draft_changes && local.draftSettings) {
    return local.draftSettings;
  }
  return local.settings;
}

export async function updateClinicSettings(
  newSettings: Partial<ClinicSettings>,
  isDraft: boolean = false,
  adminUser: string = 'owner'
): Promise<ClinicSettings> {
  const local = getLocalData();
  const current = local.settings;

  if (isDraft) {
    const updatedDraft: ClinicSettings = {
      ...current,
      ...(local.draftSettings || {}),
      ...newSettings,
      has_draft_changes: true,
      updated_at: new Date().toISOString(),
    };
    local.draftSettings = updatedDraft;
    local.settings.has_draft_changes = true;
    local.activityLogs.unshift({
      id: `log-${Date.now()}`,
      action: 'Draft Saved',
      details: 'Owner saved changes as draft.',
      admin_user: adminUser,
      timestamp: new Date().toISOString(),
    });
    saveLocalData(local);

    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin
          .from('clinic_settings')
          .upsert({
            id: 'dynasty-settings-1',
            has_draft_changes: true,
            draft_data: newSettings,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        if (error) {
          console.error('Supabase save draft error:', error);
        }
      } catch (err) {
        console.error('Supabase save draft exception:', err);
      }
    }

    return updatedDraft;
  } else {
    // Published directly
    const published: ClinicSettings = {
      ...current,
      ...newSettings,
      is_published: true,
      has_draft_changes: false,
      updated_at: new Date().toISOString(),
    };
    local.settings = published;
    local.draftSettings = undefined;
    local.activityLogs.unshift({
      id: crypto.randomUUID(),
      action: 'Settings Published',
      details: 'Owner published updated clinic settings to live website.',
      admin_user: adminUser,
      timestamp: new Date().toISOString(),
    });
    saveLocalData(local);

    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin
          .from('clinic_settings')
          .upsert({
            ...published,
            id: 'dynasty-settings-1',
            has_draft_changes: false,
            draft_data: null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        if (error) {
          console.error('Supabase publish settings error:', error);
        }
      } catch (err) {
        console.error('Supabase publish settings exception:', err);
      }
    }

    return published;
  }
}

export async function publishDraftChanges(adminUser: string = 'owner'): Promise<ClinicSettings> {
  const local = getLocalData();
  if (local.draftSettings) {
    local.settings = {
      ...local.draftSettings,
      has_draft_changes: false,
      is_published: true,
      updated_at: new Date().toISOString(),
    };
    local.draftSettings = undefined;
    local.activityLogs.unshift({
      id: crypto.randomUUID(),
      action: 'Changes Published',
      details: 'Draft changes were successfully published to live website.',
      admin_user: adminUser,
      timestamp: new Date().toISOString(),
    });
    saveLocalData(local);

    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin
          .from('clinic_settings')
          .upsert({
            ...local.settings,
            id: 'dynasty-settings-1',
            has_draft_changes: false,
            draft_data: null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        if (error) {
          console.error('Supabase publishDraftChanges error:', error);
        }
      } catch (err) {
        console.error('Supabase publishDraftChanges exception:', err);
      }
    }
  }
  return local.settings;
}

export async function discardDraftChanges(adminUser: string = 'owner'): Promise<ClinicSettings> {
  const local = getLocalData();
  local.draftSettings = undefined;
  local.settings.has_draft_changes = false;
  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Draft Discarded',
    details: 'Unpublished draft changes were reverted.',
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    await supabaseAdmin
      .from('clinic_settings')
      .update({
        has_draft_changes: false,
        draft_data: null,
      })
      .eq('id', 'dynasty-settings-1');
  }

  return local.settings;
}

// ----------------- Opening Hours -----------------

export async function getOpeningHours(): Promise<OpeningHour[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('opening_hours')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as OpeningHour[];
    } catch (err) {
      console.warn('Supabase fetch opening hours failed:', err);
    }
  }
  const local = getLocalData();
  return local.openingHours;
}

export async function updateOpeningHours(hours: OpeningHour[], adminUser: string = 'owner'): Promise<OpeningHour[]> {
  const local = getLocalData();
  local.openingHours = hours;
  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Opening Hours Updated',
    details: 'Weekly schedule and operating hours updated.',
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    for (const h of hours) {
      await supabaseAdmin.from('opening_hours').upsert(h);
    }
  }

  return local.openingHours;
}

// ----------------- Services -----------------

export async function getServices(activeOnly: boolean = false): Promise<Service[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      let query = supabaseAdmin.from('services').select('*').order('display_order', { ascending: true });
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Service[];
    } catch (err) {
      console.warn('Supabase fetch services failed:', err);
    }
  }
  const local = getLocalData();
  if (activeOnly) {
    return local.services.filter((s) => s.is_active);
  }
  return local.services;
}

export async function saveService(service: Service, adminUser: string = 'owner'): Promise<Service> {
  const local = getLocalData();
  const index = local.services.findIndex((s) => s.id === service.id);

  if (index >= 0) {
    local.services[index] = service;
  } else {
    local.services.push(service);
  }

  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Service Saved',
    details: `Service "${service.title}" added or updated.`,
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });

  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    await supabaseAdmin.from('services').upsert(service);
  }

  return service;
}

export async function deleteService(serviceId: string, adminUser: string = 'owner'): Promise<boolean> {
  const local = getLocalData();
  const prevCount = local.services.length;
  local.services = local.services.filter((s) => s.id !== serviceId);

  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Service Deleted',
    details: `Deleted service id ${serviceId}.`,
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });

  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    await supabaseAdmin.from('services').delete().eq('id', serviceId);
  }

  return local.services.length < prevCount;
}

// ----------------- Gallery Images -----------------

export async function getGalleryImages(homepageOnly: boolean = false): Promise<GalleryImage[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      let query = supabaseAdmin.from('gallery_images').select('*').order('display_order', { ascending: true });
      if (homepageOnly) {
        query = query.eq('show_on_homepage', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as GalleryImage[];
    } catch (err) {
      console.warn('Supabase fetch gallery failed:', err);
    }
  }
  const local = getLocalData();
  if (homepageOnly) {
    return local.galleryImages.filter((img) => img.show_on_homepage);
  }
  return local.galleryImages;
}

export async function saveGalleryImage(image: GalleryImage, adminUser: string = 'owner'): Promise<GalleryImage> {
  const local = getLocalData();
  const index = local.galleryImages.findIndex((img) => img.id === image.id);

  if (index >= 0) {
    local.galleryImages[index] = image;
  } else {
    local.galleryImages.push(image);
  }

  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Gallery Image Saved',
    details: `Gallery image "${image.title}" updated.`,
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });

  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    await supabaseAdmin.from('gallery_images').upsert(image);
  }

  return image;
}

export async function deleteGalleryImage(imageId: string, adminUser: string = 'owner'): Promise<boolean> {
  const local = getLocalData();
  local.galleryImages = local.galleryImages.filter((img) => img.id !== imageId);
  local.activityLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Gallery Image Deleted',
    details: `Deleted gallery photo id ${imageId}.`,
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    await supabaseAdmin.from('gallery_images').delete().eq('id', imageId);
  }

  return true;
}

// ----------------- Appointments -----------------

export async function createAppointment(data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
  const generatedId = crypto.randomUUID();
  const newAppointment: Appointment = {
    ...data,
    id: generatedId,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const local = getLocalData();
  local.appointments.unshift(newAppointment);
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('appointments').insert(newAppointment);
      if (error) {
        console.error('Supabase createAppointment error:', error);
      }
    } catch (err) {
      console.error('Supabase createAppointment exception:', err);
    }
  }

  return newAppointment;
}

export async function getAppointments(status?: string, search?: string): Promise<Appointment[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      let query = supabaseAdmin.from('appointments').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`patient_name.ilike.%${search}%,phone.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (!error && data) return data as Appointment[];
      if (error) console.warn('Supabase fetch appointments error:', error);
    } catch (err) {
      console.warn('Supabase fetch appointments failed:', err);
    }
  }

  const local = getLocalData();
  let results = [...local.appointments];

  if (status && status !== 'all') {
    results = results.filter((a) => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((a) => a.patient_name.toLowerCase().includes(q) || a.phone.includes(q));
  }

  return results;
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status'],
  adminUser: string = 'owner'
): Promise<Appointment | null> {
  const local = getLocalData();
  const item = local.appointments.find((a) => a.id === id);
  if (!item) return null;

  item.status = status;
  item.updated_at = new Date().toISOString();

  local.activityLogs.unshift({
    id: crypto.randomUUID(),
    action: 'Appointment Status Changed',
    details: `Appointment for ${item.patient_name} marked as "${status}".`,
    admin_user: adminUser,
    timestamp: new Date().toISOString(),
  });

  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.error('Supabase updateAppointmentStatus error:', err);
    }
  }

  return item;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const local = getLocalData();
  local.appointments = local.appointments.filter((a) => a.id !== id);
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      await supabaseAdmin.from('appointments').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteAppointment error:', err);
    }
  }

  return true;
}

// ----------------- Contact Messages -----------------

export async function createContactMessage(data: Omit<ContactMessage, 'id' | 'is_read' | 'is_archived' | 'created_at'>): Promise<ContactMessage> {
  const generatedId = crypto.randomUUID();
  const newMsg: ContactMessage = {
    ...data,
    id: generatedId,
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  const local = getLocalData();
  local.contactMessages.unshift(newMsg);
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('contact_messages').insert(newMsg);
      if (error) {
        console.error('Supabase createContactMessage error:', error);
      }
    } catch (err) {
      console.error('Supabase createContactMessage exception:', err);
    }
  }

  return newMsg;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch (err) {
      console.warn('Supabase fetch messages failed:', err);
    }
  }

  const local = getLocalData();
  return local.contactMessages;
}

export async function updateMessageStatus(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | null> {
  const local = getLocalData();
  const item = local.contactMessages.find((m) => m.id === id);
  if (!item) return null;

  Object.assign(item, updates);
  saveLocalData(local);

  if (isSupabaseConfigured() && supabaseAdmin) {
    await supabaseAdmin.from('contact_messages').update(updates).eq('id', id);
  }

  return item;
}

// ----------------- Activity Logs -----------------

export async function getActivityLogs(): Promise<AdminActivityLog[]> {
  const local = getLocalData();
  return local.activityLogs;
}

// ----------------- Testimonials -----------------

export async function getTestimonials(): Promise<Testimonial[]> {
  const local = getLocalData();
  return local.testimonials;
}
