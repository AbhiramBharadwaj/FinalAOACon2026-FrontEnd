# AOACON 2026 frontend

## Workshop seat availability

The registration page reads workshop capacity, remaining seats, and full status from
`registrationAPI.getPricing()` through `meta.workshops[workshop.id]`. Capacity is
configured in the backend `utils/registrationTotals.js`; keep availability driven
by that response rather than maintaining a separate frontend seat limit.

On 28 October 2026, Labour Analgesia capacity increased from 50 to 60 after all
50 seats were booked. The frontend automatically reflects the additional seats
on loading the registration page. Remaining seats depend on current bookings.

Spot Booking supports workshops at an additional ₹2,000 plus GST, subject to
seat availability. Workshop + Conference totals before GST are ₹15,000 for AOA,
₹18,000 for Non-AOA, and ₹14,000 for PGs & Fellows.

## Build

Run `npm ci` followed by `npm run build`.
