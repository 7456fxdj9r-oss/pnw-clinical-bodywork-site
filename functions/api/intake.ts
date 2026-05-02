// Cloudflare Pages Function — handles PIP intake form submissions
// Creates a contact in GHL with PIP custom fields

interface Env {
  GHL_PIT: string;
  GHL_LOCATION_ID: string;
}

interface IntakePayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  accidentDate?: string;
  insuranceCompany?: string;
  claimNumber?: string;
  policyNumber?: string;
  adjusterName?: string;
  adjusterPhone?: string;
  attorneyName?: string;
  attorneyPhone?: string;
  lawFirm?: string;
  injuryDescription?: string;
  painAreas?: string[];
  physicianName?: string;
  currentMedications?: string;
  preExistingConditions?: string;
  consentToTreat: boolean;
  hipaaAcknowledged: boolean;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://pnwclinicalbodywork.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: IntakePayload = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.phone) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, and phone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.consentToTreat || !body.hipaaAcknowledged) {
      return new Response(
        JSON.stringify({ error: 'Consent to treat and HIPAA acknowledgment are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build custom fields for PIP data
    const customFields: Array<{ key: string; field_value: string }> = [];

    if (body.claimNumber) customFields.push({ key: 'contact.pip_claim_number', field_value: body.claimNumber });
    if (body.insuranceCompany) customFields.push({ key: 'contact.pip_insurance_company', field_value: body.insuranceCompany });
    if (body.accidentDate) customFields.push({ key: 'contact.pip_date_of_accident', field_value: body.accidentDate });
    if (body.policyNumber) customFields.push({ key: 'contact.pip_policy_number', field_value: body.policyNumber });
    if (body.adjusterName) customFields.push({ key: 'contact.pip_adjuster_name', field_value: body.adjusterName });
    if (body.adjusterPhone) customFields.push({ key: 'contact.pip_adjuster_phone', field_value: body.adjusterPhone });
    if (body.attorneyName) customFields.push({ key: 'contact.attorney_name', field_value: body.attorneyName });
    if (body.attorneyPhone) customFields.push({ key: 'contact.attorney_phone', field_value: body.attorneyPhone });
    if (body.lawFirm) customFields.push({ key: 'contact.law_firm', field_value: body.lawFirm });
    if (body.injuryDescription) customFields.push({ key: 'contact.injury_description', field_value: body.injuryDescription });
    if (body.painAreas?.length) customFields.push({ key: 'contact.pain_areas', field_value: body.painAreas.join(', ') });
    if (body.physicianName) customFields.push({ key: 'contact.physician_name', field_value: body.physicianName });
    if (body.currentMedications) customFields.push({ key: 'contact.current_medications', field_value: body.currentMedications });
    if (body.preExistingConditions) customFields.push({ key: 'contact.preexisting_conditions', field_value: body.preExistingConditions });

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
        address1: body.address,
        locationId: env.GHL_LOCATION_ID,
        tags: ['pip-intake', 'website-submission'],
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

    const result = await ghlResponse.json();

    return new Response(
      JSON.stringify({ success: true, contactId: result.contact?.id }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Intake submission error:', err);
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
