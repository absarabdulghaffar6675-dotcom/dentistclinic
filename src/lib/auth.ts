import { cookies } from 'next/headers';
import { getStoredAdminCredentials, updateStoredAdminCredentials } from './db';

const COOKIE_NAME = 'dds_admin_session';

export interface AdminUser {
  email: string;
  role: 'owner' | 'staff';
  name: string;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (parsed.email) {
      return {
        email: parsed.email,
        role: parsed.role || 'owner',
        name: parsed.name || 'Clinic Owner',
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function setAdminSession(email?: string): Promise<void> {
  const cookieStore = await cookies();
  const creds = getStoredAdminCredentials();
  const effectiveEmail = email || creds.email;
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const tokenPayload = {
    email: effectiveEmail,
    role: 'owner',
    name: 'Clinic Owner',
    exp: expiresAt,
  };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyCredentials(inputEmail: string, inputPassword: string): boolean {
  const creds = getStoredAdminCredentials();
  const normalizedInputEmail = (inputEmail || '').trim().toLowerCase();
  const normalizedStoredEmail = (creds.email || '').trim().toLowerCase();

  return (
    normalizedInputEmail === normalizedStoredEmail &&
    inputPassword === creds.password
  );
}

export function verifyPassword(inputPassword: string): boolean {
  const creds = getStoredAdminCredentials();
  return inputPassword === creds.password;
}

export function getAdminCredentialsInfo(): { email: string } {
  const creds = getStoredAdminCredentials();
  return { email: creds.email };
}

export function changeAdminCredentials(newEmail: string, newPassword: string): void {
  updateStoredAdminCredentials(newEmail, newPassword);
}
