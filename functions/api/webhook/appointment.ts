// POST /api/webhook/appointment — receives GHL webhook for new appointments
// Sends Discord + email notification when someone books
// Configure in GHL: Settings → Webhooks → Add → Event: appointment.created → URL: https://pnwclinicalbodywork.com/api/webhook/appointment

interface Env {
  DISCORD_WEBHOOK_URL?: string;
  NOTIFICATION_EMAIL?: string;
  NOTIFICATION_FROM_EMAIL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Record<string, unknown>;

    // GHL webhook payload for appointments
    const contactName = (body.contact_name as string) || (body.calendarNotes as string) || 'Unknown';
    const calendarName = (body.calendar_name as string) || (body.title as string) || 'Session';
    const startTime = body.start_time as string || body.startTime as string || '';
    const contactEmail = (body.contact_email as string) || '';

    let timeDisplay = '';
    if (startTime) {
      try {
        const d = new Date(startTime);
        timeDisplay = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
          ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
      } catch { timeDisplay = startTime; }
    }

    const notifications: Promise<unknown>[] = [];

    if (env.DISCORD_WEBHOOK_URL) {
      notifications.push(
        fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'PNW Clinical Bodywork',
            embeds: [{
              title: 'New Appointment Booked',
              color: 0x059669, // emerald-600
              fields: [
                { name: 'Patient', value: contactName, inline: true },
                { name: 'Session', value: calendarName, inline: true },
                ...(timeDisplay ? [{ name: 'When', value: timeDisplay, inline: false }] : []),
              ],
              footer: { text: 'pnwclinicalbodywork.com' },
              timestamp: new Date().toISOString(),
            }],
          }),
        }).catch(() => {})
      );
    }

    if (env.NOTIFICATION_EMAIL) {
      notifications.push(
        fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: env.NOTIFICATION_EMAIL }] }],
            from: {
              email: env.NOTIFICATION_FROM_EMAIL || 'booking@pnwclinicalbodywork.com',
              name: 'PNW Clinical Bodywork',
            },
            subject: `New Booking: ${contactName}`,
            content: [{ type: 'text/plain', value: `New appointment booked:\n\nPatient: ${contactName}\nSession: ${calendarName}${timeDisplay ? `\nWhen: ${timeDisplay}` : ''}${contactEmail ? `\nEmail: ${contactEmail}` : ''}\n\nView schedule: https://portal.pnwclinicalbodywork.com` }],
          }),
        }).catch(() => {})
      );
    }

    if (notifications.length > 0) await Promise.all(notifications);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// GHL may send GET to verify the endpoint
export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ status: 'ready' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
