import { NextResponse } from 'next/server';
import { verifyCredentials, setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid owner email or password' }, { status: 401 });
    }

    await setAdminSession(email.trim().toLowerCase());

    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown login error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
