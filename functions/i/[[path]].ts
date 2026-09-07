// GET /i/<code>          → /intake?t=<token>           (the prefilled intake form)
// GET /i/<code>/ics      → /api/handoff/ics?t=<token>  (calendar file)
// GET /i/<code>/cal      → Google Calendar "add event" for the appointment
//
// Short links for the texts and emails Glen sends. The portal writes
// code → token into the LINKS store when it mints a handoff; the entry
// expires with the token. A code that is unknown, expired or tampered lands
// on the intake form with a one-line notice instead of an error page — the
// patient can still fill it out by hand.
import { verifyToken, loadAppointment, googleCalendarUrl, PRACTICE, type HandoffEnv } from '../_handoff';

const redirect = (to: string) =>
  new Response(null, { status: 302, headers: { Location: to, 'Cache-Control': 'no-store' } });

export const onRequestGet: PagesFunction<HandoffEnv> = async ({ params, env }) => {
  const segs = Array.isArray(params.path) ? params.path : [params.path];
  const code = typeof segs[0] === 'string' ? segs[0] : '';
  const kind = typeof segs[1] === 'string' ? segs[1] : '';
  const fallback = redirect(`${PRACTICE.site}/intake?expired=1`);

  if (!/^[A-Za-z0-9]{6,16}$/.test(code) || (kind && kind !== 'ics' && kind !== 'cal') || segs.length > 2) return fallback;
  if (!env.LINKS) return fallback;

  const token = await env.LINKS.get(code);
  const claims = await verifyToken(token, env.HANDOFF_SECRET);
  if (!token || !claims) return fallback;

  if (kind === 'ics') return redirect(`${PRACTICE.site}/api/handoff/ics?t=${encodeURIComponent(token)}`);
  if (kind === 'cal') {
    try {
      const appt = await loadAppointment(env, claims.a);
      if (!appt || appt.contactId !== claims.c || appt.appointmentStatus === 'cancelled') return fallback;
      return redirect(googleCalendarUrl(appt));
    } catch (err) {
      console.error('short link /cal:', err instanceof Error ? err.message : 'Unknown error');
      return fallback;
    }
  }
  return redirect(`${PRACTICE.site}/intake?t=${encodeURIComponent(token)}`);
};
