import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { getActivityLogs } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import SecurityClient from './SecurityClient';


export const instant = false;

export default async function AdminSecurityPage() {
  const session = await getAdminSession();
  const logs = await getActivityLogs();
  const supabaseConnected = isSupabaseConfigured();

  return (
    <SecurityClient
      user={session}
      logs={logs}
      supabaseConnected={supabaseConnected}
    />
  );
}
