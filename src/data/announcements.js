import scientificProgrammeFlyer from '../images/Announcements/scientific-programme-final-2026.jpg';
import septemberEarlyBirdExtension from '../images/Announcements/early-bird-extension-september-30-2026.png';
import quizCompetitionFlyer from '../images/QuizCompetition/quiz-competition-2026.jpeg';

// Add new announcements at the beginning of this list. A new `id` makes the
// bell show it as unread until the visitor opens the notification centre.
export const announcements = [
  {
    id: 'scientific-programme-final-2026-10-19',
    title: 'Latest Scientific Programme Now Available',
    summary: 'Explore the latest AOACON 2026 scientific programme with updated session timings, speakers and moderators for Halls A, B and C.',
    publishedAt: '19 October 2026',
    image: scientificProgrammeFlyer,
    imageAlt: 'AOACON 2026 latest scientific programme cover',
    href: '/conference-days',
    actionLabel: 'View scientific programme',
  },
  {
    id: 'quiz-competition-2026-10-08',
    title: 'Quiz Competition for PGs and Fellows',
    summary: 'Register for the AOACON 2026 quiz competition. Prelims are on 31st October and finals are on 1st November 2026.',
    publishedAt: '8 October 2026',
    image: quizCompetitionFlyer,
    imageAlt: 'AOACON 2026 quiz competition flyer',
    href: '/workshops/quiz-competition',
    actionLabel: 'View quiz details',
  },
  {
    id: 'early-bird-extension-2026-08-31',
    title: 'Early bird registrations till 30th September',
    summary: 'Early bird registrations are open till 30th September 2026. Regular pricing starts from 1st October 2026.',
    publishedAt: '31 August 2026',
    image: septemberEarlyBirdExtension,
    imageAlt:
      'AOACON 2026 early bird registrations till 30th September 2026',
    href: '/register-details',
    actionLabel: 'Register now',
  },
];
