// Cloudflare Pages Function — handles unified intake form submissions
// Creates a contact in GHL with all intake data as custom fields

interface Env {
  GHL_PIT: string;
  GHL_LOCATION_ID: string;
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
    const body: IntakePayload = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.phone) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, and phone are required' }),
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
