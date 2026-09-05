// Cloudflare Pages Function — handles unified intake form submissions
// Creates a contact in GHL with all intake data as custom fields

interface Env {
  GHL_PIT: string;
  GHL_LOCATION_ID: string;
  DISCORD_WEBHOOK_URL?: string;
  NOTIFICATION_EMAIL?: string;
  NOTIFICATION_FROM_EMAIL?: string;
}

/**
 * Map of GHL custom-field `fieldKey` -> field `id`, cached per isolate.
 * GHL only honours customFields addressed by `id`; entries sent by `key` are
 * accepted and then silently discarded, which is how intake PHI was being lost.
 */
let fieldIdCache: Record<string, string> | null = null;

async function loadFieldIdMap(env: Env): Promise<Record<string, string>> {
  if (fieldIdCache) return fieldIdCache;
  const res = await fetch(
    `https://services.leadconnectorhq.com/locations/${env.GHL_LOCATION_ID}/customFields`,
    {
      headers: {
        'Authorization': `Bearer ${env.GHL_PIT}`,
        'Version': '2021-07-28',
        'Accept': 'application/json',
      },
    },
  );
  if (!res.ok) {
    console.error('GHL custom field lookup failed:', res.status);
    return {};
  }
  const data = await res.json() as { customFields?: Array<{ id?: string; fieldKey?: string }> };
  const map: Record<string, string> = {};
  for (const f of data.customFields || []) {
    if (f.fieldKey && f.id) map[f.fieldKey] = f.id;
  }
  fieldIdCache = map;
  return map;
}

async function resolveCustomFieldIds(
  env: Env,
  fields: Array<{ key: string; field_value: string }>,
): Promise<Array<{ id: string; field_value: string }>> {
  if (fields.length === 0) return [];
  const map = await loadFieldIdMap(env);
  const resolved: Array<{ id: string; field_value: string }> = [];
  const unmatched: string[] = [];
  for (const f of fields) {
    const id = map[f.key];
    if (id) resolved.push({ id, field_value: f.field_value });
    else unmatched.push(f.key);
  }
  if (unmatched.length) {
    // Loud, because the failure mode this replaces was completely silent.
    console.error('GHL custom fields missing in location, values NOT saved:', unmatched.join(', '));
  }
  return resolved;
}

interface IntakePayload {
  // Patient info
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  occupation?: string;
  employer?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  // Massage history
  previousMassage?: boolean | null;
  massageTypes?: string;
  massageFrequency?: string;
  massageGoals?: string;
  // Medical
  medicalConditions?: string[];
  currentSymptoms?: string[];
  allergies?: string[];
  allergyDetails?: string;
  medications?: string;
  surgeries?: string;
  primaryCareProvider?: string;
  primaryCarePhone?: string;
  // Pain
  areasOfPain?: string[];
  // Insurance
  hasInsuranceClaim?: boolean;
  insuranceType?: string;
  insuredName?: string;
  insuredDob?: string;
  insuranceCompany?: string;
  insurancePhone?: string;
  insuranceAddress?: string;
  insuranceCity?: string;
  insuranceState?: string;
  insuranceZip?: string;
  policyNumber?: string;
  planNumber?: string;
  claimNumber?: string;
  memberNumber?: string;
  groupNumber?: string;
  idNumber?: string;
  effectiveDate?: string;
  hasDeductible?: boolean | null;
  deductibleAmount?: string;
  deductibleMet?: boolean | null;
  amountRemaining?: string;
  copayAmount?: string;
  maxVisits?: string;
  dateOfAccident?: string;
  adjusterName?: string;
  adjusterPhone?: string;
  attorneyName?: string;
  attorneyPhone?: string;
  lawFirm?: string;
  injuryDescription?: string;
  // Consent
  consentToTreat?: boolean;
  hipaAcknowledgment?: boolean;
  cancellationPolicy?: boolean;
  consentToConsult?: boolean;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://pnwclinicalbodywork.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Reject oversized payloads (50KB max for an intake form)
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > 50000) {
      return new Response(
        JSON.stringify({ error: 'Request too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: IntakePayload = await request.json();

    // content-length is client-supplied — also cap the actual parsed body
    if (JSON.stringify(body).length > 50000) {
      return new Response(
        JSON.stringify({ error: 'Request too large' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Input validation ---
    const MAX_TEXT = 200;
    const MAX_TEXTAREA = 1000;
    const MAX_ARRAY = 30;
    const MAX_IDENTIFIER = 100;

    const truncate = (val: string | undefined, max: number): string | undefined =>
      val ? val.slice(0, max) : undefined;

    const validateArraySize = (arr: unknown[] | undefined, max: number): boolean =>
      !arr || arr.length <= max;

    // Identifiers (claim/member/plan numbers, amounts) must be rejected rather than
    // silently truncated — a truncated claim number is worse than no claim number.
    const exceedsMax = (val: string | undefined, max: number): boolean =>
      typeof val === 'string' && val.length > max;

    // Date fields must be YYYY-MM-DD (what <input type="date"> submits) when present
    const isValidDate = (val: string | undefined): boolean => {
      if (!val) return true;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
      const parsed = new Date(`${val}T00:00:00Z`);
      return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === val;
    };

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.phone) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, and phone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enforce length limits on text fields
    body.firstName = truncate(body.firstName, MAX_TEXT) || '';
    body.lastName = truncate(body.lastName, MAX_TEXT) || '';
    body.email = truncate(body.email, MAX_TEXT);
    body.phone = truncate(body.phone, 20);
    body.address = truncate(body.address, MAX_TEXT);
    body.city = truncate(body.city, MAX_TEXT);
    body.state = truncate(body.state, 50);
    body.postalCode = truncate(body.postalCode, 20);
    body.occupation = truncate(body.occupation, MAX_TEXT);
    body.employer = truncate(body.employer, MAX_TEXT);
    body.emergencyContact = truncate(body.emergencyContact, MAX_TEXT);
    body.emergencyPhone = truncate(body.emergencyPhone, 20);
    body.massageTypes = truncate(body.massageTypes, MAX_TEXT);
    body.massageFrequency = truncate(body.massageFrequency, MAX_TEXT);
    body.massageGoals = truncate(body.massageGoals, MAX_TEXTAREA);
    body.allergyDetails = truncate(body.allergyDetails, MAX_TEXTAREA);
    body.medications = truncate(body.medications, MAX_TEXTAREA);
    body.surgeries = truncate(body.surgeries, MAX_TEXTAREA);
    body.primaryCareProvider = truncate(body.primaryCareProvider, MAX_TEXT);
    body.primaryCarePhone = truncate(body.primaryCarePhone, 20);
    body.insuranceCompany = truncate(body.insuranceCompany, MAX_TEXT);
    body.insurancePhone = truncate(body.insurancePhone, 20);
    body.claimNumber = truncate(body.claimNumber, MAX_TEXT);
    body.policyNumber = truncate(body.policyNumber, MAX_TEXT);
    body.attorneyName = truncate(body.attorneyName, MAX_TEXT);
    body.attorneyPhone = truncate(body.attorneyPhone, 20);
    body.adjusterName = truncate(body.adjusterName, MAX_TEXT);
    body.adjusterPhone = truncate(body.adjusterPhone, 20);
    body.lawFirm = truncate(body.lawFirm, MAX_TEXT);
    body.injuryDescription = truncate(body.injuryDescription, MAX_TEXTAREA);
    body.insuredName = truncate(body.insuredName, MAX_TEXT);

    // Validate array sizes
    if (!validateArraySize(body.medicalConditions, MAX_ARRAY) ||
        !validateArraySize(body.currentSymptoms, MAX_ARRAY) ||
        !validateArraySize(body.allergies, MAX_ARRAY) ||
        !validateArraySize(body.areasOfPain, MAX_ARRAY)) {
      return new Response(
        JSON.stringify({ error: 'Invalid form data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format (basic)
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Reject over-long identifiers and insurance values instead of truncating them
    if (exceedsMax(body.insuranceType, 50) ||
        exceedsMax(body.planNumber, MAX_IDENTIFIER) ||
        exceedsMax(body.memberNumber, MAX_IDENTIFIER) ||
        exceedsMax(body.groupNumber, MAX_IDENTIFIER) ||
        exceedsMax(body.idNumber, MAX_IDENTIFIER) ||
        exceedsMax(body.deductibleAmount, 20) ||
        exceedsMax(body.copayAmount, 20) ||
        exceedsMax(body.amountRemaining, 20) ||
        exceedsMax(body.maxVisits, 10)) {
      return new Response(
        JSON.stringify({ error: 'One or more insurance fields are too long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate date fields
    if (!isValidDate(body.dateOfBirth) ||
        !isValidDate(body.insuredDob) ||
        !isValidDate(body.effectiveDate) ||
        !isValidDate(body.dateOfAccident)) {
      return new Response(
        JSON.stringify({ error: 'Dates must be in YYYY-MM-DD format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.consentToTreat || !body.hipaAcknowledgment || !body.cancellationPolicy) {
      return new Response(
        JSON.stringify({ error: 'Consent to treat, HIPAA acknowledgment, and cancellation policy agreement are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build custom fields
    const customFields: Array<{ key: string; field_value: string }> = [];
    const addField = (key: string, value: string | undefined | null) => {
      if (value) customFields.push({ key, field_value: value });
    };

    // General intake fields
    addField('contact.occupation', body.occupation);
    addField('contact.employer', body.employer);
    addField('contact.emergency_contact', body.emergencyContact);
    addField('contact.emergency_phone', body.emergencyPhone);
    addField('contact.massage_history', body.previousMassage === true ? 'Yes' : body.previousMassage === false ? 'No' : undefined);
    addField('contact.massage_types', body.massageTypes);
    addField('contact.massage_frequency', body.massageFrequency);
    addField('contact.massage_goals', body.massageGoals);
    if (body.medicalConditions?.length) addField('contact.medical_conditions', body.medicalConditions.join(', '));
    if (body.currentSymptoms?.length) addField('contact.current_symptoms', body.currentSymptoms.join(', '));
    if (body.allergies?.length) addField('contact.allergies', body.allergies.join(', '));
    addField('contact.allergy_details', body.allergyDetails);
    addField('contact.current_medications', body.medications);
    addField('contact.surgeries_history', body.surgeries);
    addField('contact.primary_care_provider', body.primaryCareProvider);
    addField('contact.primary_care_phone', body.primaryCarePhone);
    if (body.areasOfPain?.length) addField('contact.pain_areas', body.areasOfPain.join(', '));

    // Consent attestations — record the answer plus when it was given
    const consentedAt = new Date().toISOString();
    addField('contact.consent_to_treat', body.consentToTreat === true ? `Yes (${consentedAt})` : 'No');
    addField('contact.cancellation_policy', body.cancellationPolicy === true ? `Yes (${consentedAt})` : 'No');
    addField('contact.consent_to_consult', body.consentToConsult === true ? `Yes (${consentedAt})` : `No (${consentedAt})`);

    // Insurance fields (only if insurance claim)
    if (body.hasInsuranceClaim) {
      addField('contact.insurance_type', body.insuranceType);
      addField('contact.insured_name', body.insuredName);
      addField('contact.insured_dob', body.insuredDob);
      addField('contact.pip_insurance_company', body.insuranceCompany);
      addField('contact.insurance_phone', body.insurancePhone);
      addField('contact.pip_date_of_accident', body.dateOfAccident);
      addField('contact.pip_claim_number', body.claimNumber);
      addField('contact.pip_policy_number', body.policyNumber);
      addField('contact.plan_number', body.planNumber);
      addField('contact.member_number', body.memberNumber);
      addField('contact.group_number', body.groupNumber);
      addField('contact.insurance_id_number', body.idNumber);
      addField('contact.effective_date', body.effectiveDate);
      addField('contact.deductible_amount', body.deductibleAmount);
      addField('contact.copay_amount', body.copayAmount);
      addField('contact.max_visits', body.maxVisits);
      addField('contact.pip_adjuster_name', body.adjusterName);
      addField('contact.pip_adjuster_phone', body.adjusterPhone);
      addField('contact.attorney_name', body.attorneyName);
      addField('contact.attorney_phone', body.attorneyPhone);
      addField('contact.law_firm', body.lawFirm);
      addField('contact.injury_description', body.injuryDescription);
    }

    // Build full address string
    const fullAddress = [body.address, body.city, body.state, body.postalCode].filter(Boolean).join(', ');

    // Determine tags
    const tags = ['website-submission'];
    if (body.hasInsuranceClaim) tags.push('pip-intake');
    else tags.push('new-client-intake');

    // Translate fieldKey -> field id. GHL's contacts API SILENTLY IGNORES
    // customFields entries addressed by `key` — only `id` is honoured — so every
    // value sent by key was being dropped without any error. Resolve ids from the
    // location's field list; anything unmatched is logged rather than lost quietly.
    const resolvedCustomFields = await resolveCustomFieldIds(env, customFields);

    const ghlHeaders = {
      'Authorization': `Bearer ${env.GHL_PIT}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json',
    };
    const contactFields = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      address1: fullAddress || undefined,
      customFields: resolvedCustomFields.length > 0 ? resolvedCustomFields : undefined,
    };

    // Create the contact in GHL — or update the one that already exists.
    //
    // The booking widget creates a contact before the patient ever sees this
    // form, and returning patients always match on phone or email. GHL answers a
    // duplicate with 400 and the existing record's id in meta.contactId. That
    // 400 used to fall through to the generic failure below, so every patient
    // who booked first — the intended order — lost their entire intake and was
    // told to phone the office.
    let ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify({ ...contactFields, locationId: env.GHL_LOCATION_ID, tags }),
    });
    let mergedInto: string | null = null;

    if (ghlResponse.status === 400) {
      const dup = await ghlResponse.clone().json().catch(() => null) as
        { message?: string; meta?: { contactId?: string } } | null;
      const existingId = dup?.meta?.contactId;
      if (existingId && /duplicat/i.test(dup?.message ?? '')) {
        mergedInto = existingId;
        // PUT rejects locationId in the body. Tags go through the add-tags
        // endpoint so the contact's existing tags are kept, not replaced.
        ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${existingId}`, {
          method: 'PUT',
          headers: ghlHeaders,
          body: JSON.stringify(contactFields),
        });
        if (ghlResponse.ok) {
          await fetch(`https://services.leadconnectorhq.com/contacts/${existingId}/tags`, {
            method: 'POST',
            headers: ghlHeaders,
            body: JSON.stringify({ tags }),
          }).catch((err) => { console.error('intake: could not add tags to existing contact:', err instanceof Error ? err.message : 'Unknown error'); });
        }
      }
    }

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GHL API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to submit intake form. Please call (360) 521-0804.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await ghlResponse.json() as { contact?: { id?: string } };
    if (mergedInto) console.log(`intake: merged into existing contact ${mergedInto}`);

    // Send notifications (Discord + email) — fire and forget.
    // These are de-identified on purpose: Discord and MailChannels are not covered
    // by a BAA, so no patient name, email, or phone leaves the GHL / portal boundary.
    const intakeType = body.hasInsuranceClaim ? 'Insurance / PIP Claim' : 'New Client';
    const submittedAt = new Date().toISOString();

    const notifications: Promise<unknown>[] = [];

    if (env.DISCORD_WEBHOOK_URL) {
      notifications.push(
        fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'PNW Clinical Bodywork',
            embeds: [{
              title: 'New intake received',
              description: 'A new intake was submitted. Review it in the portal: https://portal.pnwclinicalbodywork.com',
              color: 0x0F766E,
              fields: [
                { name: 'Type', value: intakeType, inline: true },
              ],
              footer: { text: 'pnwclinicalbodywork.com' },
              timestamp: submittedAt,
            }],
          }),
        }).catch((err) => { console.error('Intake Discord notification failed:', err instanceof Error ? err.message : 'Unknown error'); })
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
              email: env.NOTIFICATION_FROM_EMAIL || 'intake@pnwclinicalbodywork.com',
              name: 'PNW Clinical Bodywork',
            },
            subject: 'New intake received',
            content: [{ type: 'text/plain', value: `A new intake was submitted.\n\nType: ${intakeType}\nReceived: ${submittedAt}\n\nReview it in the portal: https://portal.pnwclinicalbodywork.com` }],
          }),
        }).catch((err) => { console.error('Intake notification email failed:', err instanceof Error ? err.message : 'Unknown error'); })
      );
    }

    if (notifications.length > 0) await Promise.all(notifications);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Intake submission error:', err instanceof Error ? err.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please call (360) 521-0804.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://pnwclinicalbodywork.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
