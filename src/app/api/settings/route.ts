import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getClinicSettings, updateClinicSettings } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const previewDraft = searchParams.get('previewDraft') === 'true';

    // If requesting draft preview, ensure user is admin
    if (previewDraft) {
      const session = await getAdminSession();
      if (!session) {
        const settings = await getClinicSettings(false);
        return NextResponse.json(settings);
      }
      const settings = await getClinicSettings(true);
      return NextResponse.json(settings);
    }

    const settings = await getClinicSettings(false);
    return NextResponse.json(settings);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching settings';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isDraft, ...settingsData } = body;

    const updated = await updateClinicSettings(
      settingsData,
      Boolean(isDraft),
      session.email
    );

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath ignored:', e);
    }

    return NextResponse.json({
      success: true,
      settings: updated,
      message: isDraft ? 'Draft changes saved' : 'Changes published successfully',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating settings';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
