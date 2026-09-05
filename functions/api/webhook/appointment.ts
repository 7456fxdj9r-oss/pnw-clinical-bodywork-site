// POST /api/webhook/appointment — receiver for GHL's appointment.created
// workflow step. GHL must send the shared secret in the `x-webhook-key` header.
//
// This endpoint deliberately does nothing beyond acknowledging the call. It
// used to email the patient an intake link and email/Discord the practice —
// via MailChannels, whose free Cloudflare sending ended 2024-06-30, so every
// one of those sends failed silently for two years, and no Discord URL was
// ever configured in production. The clinic sends no email from any system:
// the intake handoff is a click-to-email from the portal's Email button that
// Glen sends from Gmail (see the portal's src/lib/handoffEmail.ts). The route
// stays so the GHL workflow step keeps receiving a 200 instead of a 404.
// Retire it in GHL first if the workflow step is ever removed.

interface Env {
  APPOINTMENT_WEBHOOK_SECRET?: string;
}

const timingSafeEqual = (a: string, b: string): boolean => {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
  // Consume the body so GHL sees a clean 200; nothing in it is used.
  try { await request.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }
  return json({ ok: true }, 200);
};

export const onRequestGet: PagesFunction<Env> = async () => json({ status: 'ready' }, 200);
