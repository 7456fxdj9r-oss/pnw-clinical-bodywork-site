// Shared by /api/handoff and /api/handoff/ics, and — once the portal mints
// tokens — by its /api/handoff-token. Not routed (leading underscore).
//
// A token is `payload.signature`, both base64url. The payload is JSON
// {c: contactId, a: appointmentId, e: expiry (unix seconds)}; the signature is
// HMAC-SHA256 over the payload bytes with HANDOFF_SECRET. Nothing personal is
// in the token: everything personal is fetched from GHL only after it
// verifies, and the appointment must belong to the contact. Whoever holds a
// token can read one patient's name, phone, email and appointment until it
// expires — the same facts the email carrying the link already states.

export interface HandoffEnv {
  GHL_PIT: string;
  GHL_LOCATION_ID: string;
  HANDOFF_SECRET?: string;
}

export interface HandoffClaims {
  c: string; // GHL contact id
  a: string; // GHL appointment (event) id
  e: number; // expiry, unix seconds
}

const enc = new TextEncoder();

const b64url = (bytes: ArrayBuffer | Uint8Array): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromB64url = (s: string): Uint8Array => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, ch => ch.charCodeAt(0));
};

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export const timingSafeEqual = (a: string, b: string): boolean => {
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
};

export async function signToken(claims: HandoffClaims, secret: string): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify(claims)));
  return `${payload}.${await hmac(secret, payload)}`;
}

/** The claims if the token is well-formed, correctly signed and unexpired; otherwise null. */
export async function verifyToken(
  token: string | null,
  secret: string | undefined,
  now: number = Math.floor(Date.now() / 1000),
): Promise<HandoffClaims | null> {
  if (!secret || !token) return null;
  const m = /^([A-Za-z0-9_-]{1,512})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!m) return null;
  if (!timingSafeEqual(await hmac(secret, m[1]), m[2])) return null;
  let claims: Partial<HandoffClaims>;
  try { claims = JSON.parse(new TextDecoder().decode(fromB64url(m[1]))); } catch { return null; }
  const id = /^[A-Za-z0-9]{1,64}$/;
  if (typeof claims.c !== 'string' || !id.test(claims.c)) return null;
  if (typeof claims.a !== 'string' || !id.test(claims.a)) return null;
  if (typeof claims.e !== 'number' || !Number.isFinite(claims.e) || claims.e <= now) return null;
  return { c: claims.c, a: claims.a, e: claims.e };
}

export const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

async function ghlGet<T>(env: HandoffEnv, path: string, version: string): Promise<T | null> {
  const res = await fetch(`https://services.leadconnectorhq.com${path}`, {
    headers: { Authorization: `Bearer ${env.GHL_PIT}`, Version: version, Accept: 'application/json' },
  });
  // 404 = no such record; 400/422 = an id GHL won't even parse. Both mean
  // "not found" here — neither is a reason to answer 500.
  if (res.status === 404 || res.status === 400 || res.status === 422) return null;
  if (!res.ok) throw new Error(`GHL ${res.status} on ${path.split('?')[0]}`);
  return res.json() as Promise<T>;
}

export interface HandoffAppointment {
  id: string;
  contactId: string;
  calendarId: string;
  startTime: string;
  endTime: string;
  appointmentStatus?: string;
}

export async function loadAppointment(env: HandoffEnv, id: string): Promise<HandoffAppointment | null> {
  const d = await ghlGet<{ event?: HandoffAppointment; appointment?: HandoffAppointment }>(
    env, `/calendars/events/appointments/${id}`, '2021-04-15',
  );
  return d?.event ?? d?.appointment ?? null;
}

export interface HandoffContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  tags?: string[];
}

export async function loadContact(env: HandoffEnv, id: string): Promise<HandoffContact | null> {
  const d = await ghlGet<{ contact?: HandoffContact }>(env, `/contacts/${id}`, '2021-07-28');
  return d?.contact ?? null;
}

/** The three bookable calendars. Session length is used for the .ics end time. */
export const SERVICE_BY_CALENDAR: Record<string, { label: string; minutes: number }> = {
  bqERPQ65nI7B8U8aiuV6: { label: '60-Minute Session', minutes: 60 },
  J6RrXqJgAxQng60x9A7g: { label: '90-Minute Session', minutes: 90 },
  KTKamdGDgMsTGNagSEM0: { label: '2-Hour Session', minutes: 120 },
};

export const PRACTICE = {
  name: 'PNW Clinical Bodywork',
  phone: '(360) 521-0804',
  address: '5514 NE 107th Ave, Ste 101, Vancouver, WA 98662',
  site: 'https://pnwclinicalbodywork.com',
};

/** Tags written by /api/intake; the only marker that a patient has completed intake. */
export const INTAKE_TAGS = ['new-client-intake', 'pip-intake'];
