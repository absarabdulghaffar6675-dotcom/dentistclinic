import { NextResponse } from 'next/server';
import { discardDraftChanges } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await discardDraftChanges(session.email);
    return NextResponse.json({
      success: true,
      settings,
      message: 'Draft changes reverted to live version.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error discarding draft';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
