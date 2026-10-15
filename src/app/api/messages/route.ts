import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  createContactMessage,
  getContactMessages,
  updateMessageStatus,
} from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { z } from 'zod';

const messageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contact_info: z.string().min(6, 'Please enter a valid phone number or email'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = messageSchema.parse(body);

    const newMsg = await createContactMessage({
      name: validated.name.trim(),
      contact_info: validated.contact_info.trim(),
      subject: validated.subject.trim(),
      message: validated.message.trim(),
    });

    try {
      revalidatePath('/admin');
      revalidatePath('/admin/messages');
    } catch (e) {
      console.warn('revalidatePath ignored:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent to Dynasty Dental Solutions.',
      data: newMsg,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    const errorMsg = err instanceof Error ? err.message : 'Error sending message';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await getContactMessages();
    return NextResponse.json(messages);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching messages';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, is_read, is_archived } = body;

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const updated = await updateMessageStatus(id, {
      ...(is_read !== undefined && { is_read }),
      ...(is_archived !== undefined && { is_archived }),
    });

    try {
      revalidatePath('/admin');
      revalidatePath('/admin/messages');
    } catch (e) {
      console.warn('revalidatePath ignored:', e);
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating message';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
