// POST /api/webhook/appointment — receives GHL webhook for new appointments
// Sends a de-identified Discord + email notification when someone books, plus the
// patient-facing intake email.
// Configure in GHL: Settings → Webhooks → Add → Event: appointment.created → URL: https://pnwclinicalbodywork.com/api/webhook/appointment
// GHL must send the shared secret in the `x-webhook-key` request header.

interface Env {
  APPOINTMENT_WEBHOOK_SECRET?: string;
  DISCORD_WEBHOOK_URL?: string;
  NOTIFICATION_EMAIL?: string;
  NOTIFICATION_FROM_EMAIL?: string;
}

// Constant-time comparison so a wrong key can't be brute-forced by timing.
const timingSafeEqual = (a: string, b: string): boolean => {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
};

// Payload-derived strings land in email/Discord bodies — strip control characters
// (header/format injection) and cap the length.
const MAX_FIELD = 100;
const clean = (value: unknown, max: number = MAX_FIELD): string => {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // --- Authentication (header only — query strings end up in access logs) ---
  const secret = env.APPOINTMENT_WEBHOOK_SECRET;
  if (!secret) {
    console.error('appointment webhook: APPOINTMENT_WEBHOOK_SECRET is not configured');
    return json({ error: 'Unauthorized' }, 401);
  }

  const providedKey = request.headers.get('x-webhook-key') || '';
  if (!timingSafeEqual(providedKey, secret)) {
    console.error('appointment webhook: rejected request with invalid x-webhook-key');
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    // GHL webhook payload for appointments
    const contactName = clean(body.contact_name ?? body.calendarNotes) || 'Unknown';
    const calendarName = clean(body.calendar_name ?? body.title) || 'Session';
    const startTime = clean(body.start_time ?? body.startTime, 60);
    const contactEmail = clean(body.contact_email, MAX_FIELD);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? contactEmail : '';

    let timeDisplay = '';
    if (startTime) {
      try {
        const d = new Date(startTime);
        timeDisplay = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
          ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
      } catch { timeDisplay = startTime; }
    }

    const notifications: Promise<unknown>[] = [];

    // Internal alerts are de-identified — no patient name or email. Discord and
    // MailChannels are not covered under a BAA, so PHI stays in GHL / the portal.
    if (env.DISCORD_WEBHOOK_URL) {
      notifications.push(
        fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'PNW Clinical Bodywork',
            embeds: [{
              title: 'New Appointment Booked',
              description: 'Review the booking in the portal: https://portal.pnwclinicalbodywork.com',
              color: 0x059669, // emerald-600
              fields: [
                { name: 'Session', value: calendarName, inline: true },
                ...(timeDisplay ? [{ name: 'When', value: timeDisplay, inline: false }] : []),
              ],
              footer: { text: 'pnwclinicalbodywork.com' },
              timestamp: new Date().toISOString(),
            }],
          }),
        }).catch((err) => { console.error('appointment webhook: Discord notification failed:', err instanceof Error ? err.message : 'Unknown error'); })
      );
    }

    const fromEmail = env.NOTIFICATION_FROM_EMAIL || 'booking@pnwclinicalbodywork.com';

    if (env.NOTIFICATION_EMAIL) {
      notifications.push(
        fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: env.NOTIFICATION_EMAIL }] }],
            from: { email: fromEmail, name: 'PNW Clinical Bodywork' },
            subject: 'New appointment booked',
            content: [{ type: 'text/plain', value: `A new appointment was booked.\n\nSession: ${calendarName}${timeDisplay ? `\nWhen: ${timeDisplay}` : ''}\nReceived: ${new Date().toISOString()}\n\nPatient details are in the portal: https://portal.pnwclinicalbodywork.com` }],
          }),
        }).catch((err) => { console.error('appointment webhook: notification email failed:', err instanceof Error ? err.message : 'Unknown error'); })
      );
    }

    // Patient-facing intake email — fires on every appointment.created
    if (validEmail) {
      const firstName = contactName.split(' ')[0] || 'there';
      const whenLine = timeDisplay ? ` on ${timeDisplay}` : '';
      const text = `Hi ${firstName},

Thanks for booking your ${calendarName}${whenLine}. To make the most of your appointment, please fill out our intake form before you arrive:

https://pnwclinicalbodywork.com/intake

If your visit is being billed through PIP / auto insurance, use this link instead so we can capture your claim info:

https://pnwclinicalbodywork.com/intake?insurance=true

It only takes a few minutes and saves time when you arrive. Questions? Just reply to this email.

— Glen Arn, LMT
PNW Clinical Bodywork
5514 NE 107th Ave., Ste. 101, Vancouver, WA 98662`;

      notifications.push(
        fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: validEmail }] }],
            from: { email: fromEmail, name: 'Glen Arn — PNW Clinical Bodywork' },
            reply_to: { email: fromEmail, name: 'PNW Clinical Bodywork' },
            subject: 'Welcome to PNW Clinical Bodywork — quick intake form',
            content: [{ type: 'text/plain', value: text }],
          }),
        }).catch((err) => { console.error('appointment webhook: patient intake email failed:', err instanceof Error ? err.message : 'Unknown error'); })
      );
    }

    if (notifications.length > 0) await Promise.all(notifications);

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('appointment webhook error:', err instanceof Error ? err.message : 'Unknown error');
    return json({ error: 'Failed to process webhook' }, 500);
  }
};

// GHL may send GET to verify the endpoint
export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ status: 'ready' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
