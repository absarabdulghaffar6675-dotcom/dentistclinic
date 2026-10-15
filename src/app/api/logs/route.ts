import { NextResponse } from 'next/server';
import { getActivityLogs } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await getActivityLogs();
    return NextResponse.json(logs);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching logs';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
