import { NextResponse } from 'next/server';
import { getGalleryImages, saveGalleryImage, deleteGalleryImage } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const homepageOnly = searchParams.get('homepage') === 'true';
    const images = await getGalleryImages(homepageOnly);
    return NextResponse.json(images);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching gallery';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const image = await request.json();
    if (!image.image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!image.id) {
      image.id = `g-${Date.now()}`;
    }

    const saved = await saveGalleryImage(image, session.email);
    return NextResponse.json({ success: true, image: saved });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error saving gallery image';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
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
      return NextResponse.json({ error: 'Image id is required' }, { status: 400 });
    }

    await deleteGalleryImage(id, session.email);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting image';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
