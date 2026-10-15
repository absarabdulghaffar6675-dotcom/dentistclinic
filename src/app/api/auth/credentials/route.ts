import { NextResponse } from 'next/server';
import {
  getAdminSession,
  verifyPassword,
  getAdminCredentialsInfo,
  changeAdminCredentials,
  setAdminSession,
} from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const info = getAdminCredentialsInfo();
    return NextResponse.json({ email: info.email });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching credentials';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required to authorize changes' },
        { status: 400 }
      );
    }

    if (!verifyPassword(currentPassword)) {
      return NextResponse.json(
        { error: 'Current password does not match' },
        { status: 401 }
      );
    }

    if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const currentCreds = getAdminCredentialsInfo();
    let finalPassword = currentPassword;

    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      finalPassword = newPassword;
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    changeAdminCredentials(cleanEmail, finalPassword);

    // Refresh current admin session cookie with the new email
    await setAdminSession(cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Admin email and password updated successfully!',
      email: cleanEmail,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating credentials';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
