// Cloudflare Pages Function — handles unified intake form submissions
// Creates a contact in GHL with all intake data as custom fields

interface Env {
  GHL_PIT: string;
  GHL_LOCATION_ID: string;
  DISCORD_WEBHOOK_URL?: string;
  NOTIFICATION_EMAIL?: string;
  NOTIFICATION_FROM_EMAIL?: string;
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

    // --- Input validation ---
    const MAX_TEXT = 200;
    const MAX_TEXTAREA = 1000;
    const MAX_ARRAY = 30;

    const truncate = (val: string | undefined, max: number): string | undefined =>
      val ? val.slice(0, max) : undefined;

    const validateArraySize = (arr: unknown[] | undefined, max: number): boolean =>
      !arr || arr.length <= max;

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

    if (!body.consentToTreat || !body.hipaAcknowledgment) {
      return new Response(
        JSON.stringify({ error: 'Consent to treat and HIPAA acknowledgment are required' }),
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

    // Create contact in GHL
    const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GHL_PIT}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth,
        address1: fullAddress || undefined,
        locationId: env.GHL_LOCATION_ID,
        tags,
        customFields: customFields.length > 0 ? customFields : undefined,
      }),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GHL API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to submit intake form. Please call (360) 521-0804.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await ghlResponse.json() as { contact?: { id?: string } };

    // Send notifications (Discord + email) — fire and forget
    const patientName = `${body.firstName} ${body.lastName}`;
    const intakeType = body.hasInsuranceClaim ? 'Insurance / PIP Claim' : 'New Client';
    const notifyPayload = JSON.stringify({
      name: patientName,
      email: body.email || '',
      type: intakeType,
    });

    const notifications: Promise<unknown>[] = [];

    if (env.DISCORD_WEBHOOK_URL) {
      notifications.push(
        fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'PNW Clinical Bodywork',
            embeds: [{
              title: 'New Patient Intake Submission',
              color: 0x0F766E,
              fields: [
                { name: 'Patient', value: patientName, inline: true },
                { name: 'Type', value: intakeType, inline: true },
                ...(body.email ? [{ name: 'Email', value: body.email, inline: true }] : []),
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
              email: env.NOTIFICATION_FROM_EMAIL || 'intake@pnwclinicalbodywork.com',
              name: 'PNW Clinical Bodywork',
            },
            subject: `New Intake: ${patientName}`,
            content: [{ type: 'text/plain', value: `New ${intakeType} intake:\n\nPatient: ${patientName}${body.email ? `\nEmail: ${body.email}` : ''}${body.phone ? `\nPhone: ${body.phone}` : ''}\n\nReview at: https://portal.pnwclinicalbodywork.com` }],
          }),
        }).catch(() => {})
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
