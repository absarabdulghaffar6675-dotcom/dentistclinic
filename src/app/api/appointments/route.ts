import { NextResponse } from 'next/server';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { z } from 'zod';

const appointmentSchema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  requested_date: z.string().min(1, 'Please select a date'),
  requested_time: z.string().min(1, 'Please select a preferred time'),
  service_id: z.string().optional(),
  service_title: z.string().min(1, 'Please select a service'),
  notes: z.string().optional(),
  consent_given: z.boolean().refine((val) => val === true, 'Consent is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = appointmentSchema.parse(body);

    const newAppointment = await createAppointment({
      patient_name: validated.patient_name.trim(),
      phone: validated.phone.trim(),
      email: validated.email ? validated.email.trim() : undefined,
      requested_date: validated.requested_date,
      requested_time: validated.requested_time,
      service_id: validated.service_id || 'general',
      service_title: validated.service_title,
      notes: validated.notes?.trim() || '',
      status: 'pending',
      consent_given: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment request received! Our clinic team will call you to confirm your slot.',
      appointment: newAppointment,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    const errorMsg = err instanceof Error ? err.message : 'Error processing appointment';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const list = await getAppointments(status, search);
    return NextResponse.json(list);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching appointments';
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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    const updated = await updateAppointmentStatus(id, status, session.email);
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating appointment';
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
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteAppointment(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting appointment';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
