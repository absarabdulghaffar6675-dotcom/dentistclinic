import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { publishDraftChanges } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const published = await publishDraftChanges(session.email);
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath ignored:', e);
    }
    return NextResponse.json({
      success: true,
      settings: published,
      message: 'All draft changes have been published to the live website!',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error publishing changes';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
