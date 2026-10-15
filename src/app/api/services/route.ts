import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServices, saveService, deleteService } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const services = await getServices(activeOnly);
    return NextResponse.json(services);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching services';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = await request.json();
    if (!service.title) {
      return NextResponse.json({ error: 'Service title is required' }, { status: 400 });
    }

    if (!service.id) {
      service.id = `s-${Date.now()}`;
    }
    if (!service.slug) {
      service.slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const saved = await saveService(service, session.email);
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath ignored:', e);
    }
    return NextResponse.json({ success: true, service: saved });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error saving service';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service id is required' }, { status: 400 });
    }

    await deleteService(id, session.email);
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath ignored:', e);
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting service';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
