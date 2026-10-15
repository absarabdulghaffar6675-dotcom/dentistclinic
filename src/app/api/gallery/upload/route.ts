import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload JPG, PNG, WebP, or SVG.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // If Supabase Storage is configured, upload to bucket
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin.storage
          .from('clinic-assets')
          .upload(cleanName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('clinic-assets')
            .getPublicUrl(cleanName);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            filename: cleanName,
            storage: 'supabase',
          });
        }
        console.warn('Supabase storage upload failed, saving locally:', error);
      } catch (uploadErr) {
        console.warn('Supabase upload exception, saving locally:', uploadErr);
      }
    }

    // Local persistent storage in public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${cleanName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: cleanName,
      storage: 'local',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error uploading image';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
