export const USER_ROLES = {
  AOA: 'AOA',
  NON_AOA: 'NON_AOA',
  PGS: 'PGS'
};

export const REGISTRATION_TYPES = {
  CONFERENCE_ONLY: 'CONFERENCE_ONLY',
  WORKSHOP_CONFERENCE: 'WORKSHOP_CONFERENCE',
  COMBO: 'COMBO'
};

export const BOOKING_PHASES = {
  EARLY_BIRD: 'EARLY_BIRD',
  REGULAR: 'REGULAR',
  SPOT: 'SPOT'
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED'
};

export const ABSTRACT_CATEGORIES = [
  { value: 'CLINICAL_RESEARCH', label: 'Clinical Research' },
  { value: 'CASE_STUDY', label: 'Case Study' },
  { value: 'REVIEW_ARTICLE', label: 'Review Article' },
  { value: 'ORIGINAL_RESEARCH', label: 'Original Research' },
  { value: 'EPIDEMIOLOGICAL_STUDY', label: 'Epidemiological Study' },
  { value: 'SURGICAL_TECHNIQUE', label: 'Surgical Technique' },
  { value: 'DRUG_TRIAL', label: 'Drug Trial' },
  { value: 'DIAGNOSTIC_METHOD', label: 'Diagnostic Method' },
  { value: 'PREVENTIVE_CARE', label: 'Preventive Care' },
  { value: 'HEALTHCARE_POLICY', label: 'Healthcare Policy' }
];

export const ABSTRACT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const CONFERENCE_DATES = [
  { date: '2024-10-30', label: 'Day 1 - Oct 30' },
  { date: '2024-10-31', label: 'Day 2 - Oct 31' },
  { date: '2024-11-01', label: 'Day 3 - Nov 1' }
];