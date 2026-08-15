import independenceDayEarlyBird from '../images/Announcements/independence-day-early-bird-2026.png';

// Add new announcements at the beginning of this list. A new `id` makes the
// bell show it as unread until the visitor opens the notification centre.
export const announcements = [
  {
    id: 'early-bird-extension-2026-08-15',
    title: 'Early bird registrations extended',
    summary: 'Early bird registration is now open until August 31, 2026.',
    publishedAt: '15 August 2026',
    image: independenceDayEarlyBird,
    imageAlt:
      'AOACON 2026 Independence Day announcement: early bird registrations extended until August 31',
    href: '/register-details',
    actionLabel: 'Register now',
  },
];
