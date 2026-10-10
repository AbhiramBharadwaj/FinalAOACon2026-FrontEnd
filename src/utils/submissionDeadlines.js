export const ABSTRACT_SUBMISSION_DEADLINE_LABEL = '15th October 2026';
export const E_POSTER_SUBMISSION_DEADLINE_LABEL = '18th October 2026';

export const ABSTRACT_SUBMISSION_CUTOFF = new Date('2026-10-15T18:29:59.999Z');
export const E_POSTER_SUBMISSION_CUTOFF = new Date('2026-10-18T18:29:59.999Z');

export const isAfterSubmissionDeadline = (deadline, now = new Date()) =>
  now.getTime() > deadline.getTime();

export const isAbstractSubmissionOpen = (now) =>
  !isAfterSubmissionDeadline(ABSTRACT_SUBMISSION_CUTOFF, now);

export const isEPosterSubmissionOpen = (now) =>
  !isAfterSubmissionDeadline(E_POSTER_SUBMISSION_CUTOFF, now);
