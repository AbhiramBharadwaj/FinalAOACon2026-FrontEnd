import {
  ExternalLink,
  Hotel,
  Info,
  MapPin,
  Phone,
} from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';

const accommodationGroups = [
  {
    id: 'within-5-km',
    title: 'Within 5 km of SIMS',
    description: 'Hotels located in and around central Shivamogga.',
    properties: [
      {
        name: 'Cliff Embassy Banquet & Suites',
        type: 'Hotel & suites',
        summary: 'AC and non-AC rooms, suites, vegetarian dining, a lounge bar and conference facilities.',
        address: 'Kuvempu Road, next to Nandi Petrol Bunk, Sharavathi Nagar, Hosamane, Shivamogga – 577202',
        phones: ['+91 63648 70472'],
        website: 'https://www.cliffembassy.com/',
        mapQuery: 'Cliff Embassy Banquet and Suites Shivamogga',
      },
      {
        name: 'Akash Inn',
        type: 'Business hotel',
        summary: 'Air-conditioned rooms and suites with Wi-Fi, two restaurants, a bar and on-site parking.',
        address: 'Ratnamma Madhava Rao Road, Durgigudi, Shivamogga – 577201',
        phones: ['+91 70266 21333', '08182 228888'],
        website: 'https://www.akashinn.in/',
        mapQuery: 'Akash Inn Shivamogga',
      },
      {
        name: 'Harsha The Fern',
        type: 'Upscale hotel',
        summary: 'An 88-room hotel with contemporary accommodation, dining and extensive event facilities.',
        address: '35/2A, opposite Sharavathi Dental College Road, Sagara Road, Shivamogga – 577202',
        phones: ['+91 90199 26103', '08182 264555'],
        website: 'https://www.fernhotels.com/metro-getaway-cities/harsha-the-fern-an-ecotel-hotel-shivamogga',
        mapQuery: 'Harsha The Fern Shivamogga',
      },
      {
        name: 'Royal Ritis',
        type: 'Hotel',
        summary: 'Air-conditioned rooms, free Wi-Fi, restaurants, a bar, room service and on-site parking.',
        address: 'Balraj Urs Road, KEB Circle, near Shivamogga Railway Station, Shivamogga – 577201',
        phones: ['+91 70423 91607'],
        mapQuery: 'Royal Ritis Shivamogga',
      },
      {
        name: 'Hotel Ashoka Grand',
        type: 'Hotel',
        summary: 'Straightforward rooms, including air-conditioned and family options, with vegetarian dining and parking.',
        address: 'Sagar Road, Sharavathi Nagar, Hosamane, Shivamogga – 577201',
        phones: ['+91 94814 82129'],
        mapQuery: 'Hotel Ashoka Grand Shivamogga',
      },
      {
        name: 'Royal Orchid Central',
        type: 'Business hotel',
        summary: 'Contemporary rooms with dining, business services and banquet facilities near the city centre.',
        address: 'B.H. Road, Kalyan Mandir Road, opposite Parekh Vinayaka Mall, K.R. Puram, Shivamogga – 577202',
        phones: ['08182 409999', '08182 401999', '+91 99000 24165'],
        website: 'https://www.royalorchidhotels.com/royal-orchid-central-shimoga',
        mapQuery: 'Royal Orchid Central Shivamogga',
      },
      {
        name: 'Sri Sai Palace',
        type: 'Lodge',
        summary: 'AC and non-AC rooms, family accommodation, 24-hour hot water, lounge Wi-Fi and underground parking.',
        address: 'Garden Area, 2nd Cross MRT, near Municipal Building, Shivamogga – 577201',
        phones: ['+91 88677 70151', '+91 73489 59759', '+91 72040 82245'],
        website: 'https://srisaipalace.net/',
        mapQuery: 'Sri Sai Palace Lodge Shivamogga',
      },
      {
        name: 'Hotel Jai Maata Grandeur',
        type: 'Hotel',
        summary: 'Rooms and suites with air conditioning, Wi-Fi, complimentary parking and on-site vegetarian dining.',
        address: 'Opposite Bharatiya Vidya Bhavan, Vidya Nagar, B.H. Road, Shivamogga – 577203',
        phones: ['+91 95133 90777', '08182 241777'],
        website: 'https://www.jaimaatagrandeur.com/',
        mapQuery: 'Hotel Jai Maata Grandeur Shivamogga',
      },
      {
        name: 'Jewel Rock Hotel',
        type: 'Hotel',
        summary: 'Comfortable rooms with Wi-Fi, restaurants, a bar, room service and event facilities.',
        address: 'JPN Road, Durgigudi, Mission Compound, Shivamogga – 577201',
        phones: ['08182 223051', '08182 223056'],
        mapQuery: 'Jewel Rock Hotel Shivamogga',
      },
    ],
  },
  {
    id: 'within-10-km',
    title: 'Within 10 km of SIMS',
    description: 'Resort-style stays on the quieter outskirts of Shivamogga.',
    properties: [
      {
        name: 'Kimmane Luxury Golf Resort',
        type: 'Golf resort',
        summary: 'A 100-acre luxury resort with rooms and suites, a 9-hole golf course, pool, spa, dining and outdoor activities.',
        address: '35/2, Aladevara Hosur, Bangalore–Honnavar Highway, behind PESIT College, Shivamogga – 577205',
        phones: ['+91 90199 60032', '+91 90199 60035'],
        website: 'https://www.kimmaneresorts.com/',
        mapQuery: 'Kimmane Luxury Golf Resort Shivamogga',
        distanceNote: 'Approximately 8.8–9 km by road from SIMS',
      },
      {
        name: 'Malnad Shire Eco Resort',
        type: 'Eco resort',
        summary: 'Cottage-style accommodation with a swimming pool, spa, restaurant, Wi-Fi and on-site parking.',
        address: 'N.R. Pura Road, next to Mallesh Convention Centre, Santhekadur, Shivamogga – 577222',
        phones: ['+91 77602 65111'],
        website: 'https://www.malnadshire.com/',
        mapQuery: 'Malnad Shire Eco Resort Shivamogga',
      },
    ],
  },
];

const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
const mapHref = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const AccommodationRow = ({ property }) => (
  <article className="border-t border-slate-200 py-6 first:border-t-0 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(15rem,0.9fr)] lg:gap-10 lg:py-7">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9c3253]">
        {property.type}
      </p>
      <h3 className="mt-1.5 text-lg font-semibold leading-snug text-slate-950">
        {property.name}
      </h3>
      {property.distanceNote && (
        <p className="mt-2 text-xs font-medium text-[#005aa9]">
          {property.distanceNote}
        </p>
      )}
    </div>

    <div className="mt-4 lg:mt-0">
      <p className="text-sm leading-6 text-slate-600">{property.summary}</p>
      <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-600">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span>{property.address}</span>
      </div>
    </div>

    <div className="mt-4 border-t border-slate-100 pt-4 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <div className="flex items-start gap-2">
        <Phone className="mt-1 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {property.phones.map((phone) => (
            <a
              key={phone}
              href={phoneHref(phone)}
              className="text-sm font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-[#9c3253]"
            >
              {phone}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
        {property.website && (
          <a
            href={property.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#005aa9] hover:text-[#00467f]"
          >
            Visit website
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        <a
          href={mapHref(property.mapQuery)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-950"
        >
          View on map
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </article>
);

const AccommodationListPage = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header />

    <main className="pb-24 pt-24 sm:pt-28 lg:pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-center gap-3 text-[#9c3253]">
            <Hotel className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              AOACON 2026 · Shivamogga
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Hotels and lodging
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            A list of accommodation options near Shivamogga Institute of Medical Sciences (SIMS). Please contact the property or visit its website directly for availability, current rates and reservations.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <aside className="flex items-start gap-3 border-b border-slate-200 py-5 text-sm leading-6 text-slate-600">
          <Info className="mt-1 h-4 w-4 shrink-0 text-[#005aa9]" aria-hidden="true" />
          <p>
            Distances are approximate road-distance groups from SIMS and may vary with the selected route. AOACON does not manage bookings or collect accommodation payments.
          </p>
        </aside>

        {accommodationGroups.map((group) => (
          <section key={group.id} aria-labelledby={group.id} className="py-10 sm:py-12">
            <div className="border-b-2 border-slate-900 pb-4 sm:flex sm:items-end sm:justify-between sm:gap-8">
              <h2 id={group.id} className="text-xl font-semibold text-slate-950 sm:text-2xl">
                {group.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500 sm:mt-0">{group.description}</p>
            </div>

            <div>
              {group.properties.map((property) => (
                <AccommodationRow key={property.name} property={property} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>

    <MobileNav />
  </div>
);

export default AccommodationListPage;
