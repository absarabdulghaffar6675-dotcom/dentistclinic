import { NextResponse } from 'next/server';
import { getOpeningHours, updateOpeningHours } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const hours = await getOpeningHours();
    return NextResponse.json(hours);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching hours';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hours } = await request.json();
    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: 'Hours array expected' }, { status: 400 });
    }

    const updated = await updateOpeningHours(hours, session.email);
    return NextResponse.json({ success: true, hours: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating hours';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
