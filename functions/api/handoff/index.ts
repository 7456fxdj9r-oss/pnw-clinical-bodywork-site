// GET /api/handoff?t=<token>
// The intake page calls this to prefill name, phone, email and date of birth
// for the patient the token names, and to learn whether they already have an
// intake on file. Returns 401 for a bad or expired token, 404 if the
// appointment and contact don't match, 410 if the appointment was cancelled.
import {
  verifyToken, json, loadAppointment, loadContact, SERVICE_BY_CALENDAR, INTAKE_TAGS,
  type HandoffEnv,
} from '../../_handoff';

export const onRequestGet: PagesFunction<HandoffEnv> = async ({ request, env }) => {
  const claims = await verifyToken(new URL(request.url).searchParams.get('t'), env.HANDOFF_SECRET);
  if (!claims) return json({ error: 'This link is invalid or has expired.' }, 401);

  try {
    const [appt, contact] = await Promise.all([loadAppointment(env, claims.a), loadContact(env, claims.c)]);
    if (!appt || !contact || appt.contactId !== contact.id) return json({ error: 'Appointment not found.' }, 404);
    if (appt.appointmentStatus === 'cancelled') return json({ error: 'This appointment was cancelled.' }, 410);

    const tags = contact.tags ?? [];
    return json({
      firstName: contact.firstName ?? '',
      lastName: contact.lastName ?? '',
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      dateOfBirth: contact.dateOfBirth ?? '',
      hasIntake: INTAKE_TAGS.some(t => tags.includes(t)),
      hasPip: tags.includes('pip-intake'),
      appointment: {
        startTime: appt.startTime,
        endTime: appt.endTime,
        service: SERVICE_BY_CALENDAR[appt.calendarId]?.label ?? null,
        minutes: SERVICE_BY_CALENDAR[appt.calendarId]?.minutes ?? null,
      },
    }, 200);
  } catch (err) {
    console.error('handoff:', err instanceof Error ? err.message : 'Unknown error');
    return json({ error: 'Could not load your details right now.' }, 500);
  }
};
