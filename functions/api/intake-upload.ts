// POST /api/intake-upload  (multipart: t, fileType, file)
// A patient adds a photo of their insurance card or license from the intake
// success screen. The website has no login, so the upload is authorised by a
// short-lived token that /api/intake hands back on success — bound to the
// contact just created or updated (claims.a === 'upload'). Same storage as the
// portal's own uploads: the private R2 bucket, the same key shape, the same
// portal /api/media URL written into the same GHL fields, so Glen sees the
// photo in the portal exactly as if he had uploaded it himself.
import { verifyToken, json, type HandoffEnv } from '../_handoff';

interface Env extends HandoffEnv {
  MEDIA?: R2Bucket;
}

const MAX_BYTES = 10 * 1024 * 1024;
const FIELD_KEY_FOR: Record<string, string> = {
  drivers_license: 'contact.drivers_license_photo',
  insurance_card: 'contact.insurance_card_photo',
  insurance_card_back: 'contact.insurance_card_back_photo',
};
const EXT_FOR_TYPE: Record<string, string> = { png: 'png', jpeg: 'jpg', gif: 'gif', webp: 'webp', heic: 'heic' };
const CONTENT_TYPE_FOR_TYPE: Record<string, string> = {
  png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', heic: 'image/heic',
};

const startsWith = (buf: Uint8Array, sig: number[], offset = 0): boolean =>
  buf.length >= offset + sig.length && sig.every((b, i) => buf[offset + i] === b);

/** Magic-number check — the client's declared MIME type is attacker-controlled. Mirrors the portal. */
function sniffImageType(buf: Uint8Array): string | null {
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47])) return 'png';
  if (startsWith(buf, [0xff, 0xd8, 0xff])) return 'jpeg';
  if (startsWith(buf, [0x47, 0x49, 0x46, 0x38])) return 'gif';
  if (startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8)) return 'webp';
  if (startsWith(buf, [0x66, 0x74, 0x79, 0x70], 4)) return 'heic';
  return null;
}

/** SVG/XML can carry <script> — never accept it as an "image". */
function looksLikeMarkup(buf: Uint8Array): boolean {
  let i = 0;
  while (i < buf.length && (buf[i] === 0x20 || buf[i] === 0x09 || buf[i] === 0x0a || buf[i] === 0x0d)) i++;
  if (buf[i] === 0xef && buf[i + 1] === 0xbb && buf[i + 2] === 0xbf) i += 3;
  return buf[i] === 0x3c;
}

let fieldIdCache: Record<string, string> | null = null;
async function resolveFieldId(env: Env, fieldKey: string): Promise<string | null> {
  if (!fieldIdCache) {
    const res = await fetch(`https://services.leadconnectorhq.com/locations/${env.GHL_LOCATION_ID}/customFields`, {
      headers: { Authorization: `Bearer ${env.GHL_PIT}`, Version: '2021-07-28', Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json() as { customFields?: Array<{ id?: string; fieldKey?: string }> };
    const map: Record<string, string> = {};
    for (const f of data.customFields || []) if (f.fieldKey && f.id) map[f.fieldKey] = f.id;
    fieldIdCache = map;
  }
  return fieldIdCache[fieldKey] || null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.MEDIA) return json({ error: 'Photo upload is not available right now.' }, 503);

  let form: FormData;
  try { form = await request.formData(); } catch { return json({ error: 'Expected a file upload.' }, 400); }

  const token = form.get('t');
  const claims = await verifyToken(typeof token === 'string' ? token : null, env.HANDOFF_SECRET);
  if (!claims || claims.a !== 'upload') return json({ error: 'This upload link is invalid or has expired.' }, 401);
  const contactId = claims.c;

  const fileType = form.get('fileType');
  if (typeof fileType !== 'string' || !FIELD_KEY_FOR[fileType]) return json({ error: 'Unknown document type.' }, 400);
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'No file received.' }, 400);
  if (file.size === 0) return json({ error: 'That file is empty.' }, 400);
  if (file.size > MAX_BYTES) return json({ error: 'Photos must be under 10 MB.' }, 400);

  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (looksLikeMarkup(head)) return json({ error: 'Only photos are accepted.' }, 400);
  const imageType = sniffImageType(head);
  if (!imageType) return json({ error: 'Only PNG, JPEG, GIF, WEBP or HEIC photos are accepted.' }, 400);

  const objectKey = `patients/${contactId}/${fileType}-${crypto.randomUUID()}.${EXT_FOR_TYPE[imageType]}`;
  try {
    await env.MEDIA.put(objectKey, file.stream(), {
      httpMetadata: { contentType: CONTENT_TYPE_FOR_TYPE[imageType] },
      customMetadata: { uploadedBy: 'patient-website', contactId, fileType, uploadedAt: new Date().toISOString() },
    });
  } catch (err) {
    console.error('intake-upload: R2 put failed:', err instanceof Error ? err.message : 'Unknown error');
    return json({ error: 'Could not save the photo right now.' }, 500);
  }

  // Same URL shape the portal writes, so its record view renders this photo the same way.
  const fileUrl = `https://portal.pnwclinicalbodywork.com/api/media/${objectKey}`;
  const fieldId = await resolveFieldId(env, FIELD_KEY_FOR[fileType]);
  if (!fieldId) {
    console.error('intake-upload: GHL field not found:', FIELD_KEY_FOR[fileType]);
    return json({ error: 'Saved, but could not attach it to your record. Please bring the card to your visit.' }, 500);
  }
  const link = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${env.GHL_PIT}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ customFields: [{ id: fieldId, field_value: fileUrl }] }),
  });
  if (!link.ok) {
    console.error('intake-upload: GHL field write failed:', link.status);
    return json({ error: 'Saved, but could not attach it to your record. Please bring the card to your visit.' }, 500);
  }
  return json({ ok: true }, 200);
};
