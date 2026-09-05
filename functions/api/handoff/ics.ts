// GET /api/handoff/ics?t=<token>
// A calendar file for the patient's appointment, linked from the email Glen
// sends. Same token rules as /api/handoff. No patient name or clinical detail
// goes into the file — it lands in the patient's own calendar and the summary
// only needs to tell them what and where.
import {
  verifyToken, json, loadAppointment, SERVICE_BY_CALENDAR, PRACTICE,
  type HandoffEnv,
} from '../../_handoff';

/** 2026-09-10T18:30:00.000Z → 20260910T183000Z */
const icsUtc = (iso: string): string => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

/** RFC 5545 text escaping. */
const esc = (s: string): string => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export const onRequestGet: PagesFunction<HandoffEnv> = async ({ request, env }) => {
  const claims = await verifyToken(new URL(request.url).searchParams.get('t'), env.HANDOFF_SECRET);
  if (!claims) return json({ error: 'This link is invalid or has expired.' }, 401);

  try {
    const appt = await loadAppointment(env, claims.a);
    if (!appt || appt.contactId !== claims.c) return json({ error: 'Appointment not found.' }, 404);
    if (appt.appointmentStatus === 'cancelled') return json({ error: 'This appointment was cancelled.' }, 410);

    const service = SERVICE_BY_CALENDAR[appt.calendarId];
    // End at start + session length. Appointments booked from the portal's
    // "Pick any day / time" carry the 15-minute buffer in their stored end time;
    // the patient's calendar should show the session, not the gap after it.
    const start = new Date(appt.startTime);
    const end = service ? new Date(start.getTime() + service.minutes * 60000) : new Date(appt.endTime);
    const summary = `${service ? service.label : 'Appointment'} with Glen — ${PRACTICE.name}`;
    const description = `Reply to Glen's email or call ${PRACTICE.phone} if anything needs to change.`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PNW Clinical Bodywork//Handoff//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${appt.id}@pnwclinicalbodywork.com`,
      `DTSTAMP:${icsUtc(new Date().toISOString())}`,
      `DTSTART:${icsUtc(start.toISOString())}`,
      `DTEND:${icsUtc(end.toISOString())}`,
      `SUMMARY:${esc(summary)}`,
      `LOCATION:${esc(PRACTICE.address)}`,
      `DESCRIPTION:${esc(description)}`,
      `URL:${PRACTICE.site}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    return new Response(lines.join('\r\n') + '\r\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="pnw-clinical-bodywork.ics"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('handoff/ics:', err instanceof Error ? err.message : 'Unknown error');
    return json({ error: 'Could not build the calendar file right now.' }, 500);
  }
};
