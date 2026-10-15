import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  );
};

// Public client (for browser and public queries)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server admin client (for privileged database/storage tasks)
export const supabaseAdmin = (isSupabaseConfigured() && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : (supabase || null);
