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
  { value: 'ORIGINAL_RESEARCH', label: 'Original Research' },
  { value: 'CLINICAL_AUDIT_QUALITY_IMPROVEMENT', label: 'Clinical Audit / Quality Improvement' },
  { value: 'CASE_REPORT_CASE_SERIES', label: 'Case Report / Case Series' },
  { value: 'REVIEW_EDUCATIONAL_POSTER', label: 'Review / Educational Poster' },
  { value: 'INNOVATIONS_IN_LABOUR_ANALGESIA_OBSTETRIC_ANAESTHESIA', label: 'Innovations in Labour Analgesia / Obstetric Anaesthesia' },
  { value: 'PATIENT_SAFETY_IN_OBSTETRIC_ANAESTHESIA', label: 'Patient Safety in Obstetric Anaesthesia' },
  { value: 'SIMULATION_TRAINING_INITIATIVES', label: 'Simulation / Training Initiatives' },
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
