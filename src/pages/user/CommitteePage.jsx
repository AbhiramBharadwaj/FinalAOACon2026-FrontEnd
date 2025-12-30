import { Users, Calendar, MapPin, Star } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PLACEHOLDER_IMAGE =
  'https://thumbs.dreamstime.com/b/profile-placeholder-image-gray-silhouette-no-photo-person-avatar-default-pic-used-web-design-173998594.jpg';

const committees = [
  {
    sectionTitle: 'Organising Committee',
    roles: [
      {
        role: 'Leadership',
        members: [
          {
            name: 'Dr Virupakshappa V',
            designation: 'Chief Patron',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Nagendra S',
            designation: 'Patron',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Dhananjaya Sarji',
            designation: 'Patron',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Ajith Shetty',
            designation: 'Patron',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Avinash Benakappa',
            designation: 'Patron',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Champa',
            designation: 'Organising Secretary',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Ashwini',
            designation: 'Treasurer',
            image: PLACEHOLDER_IMAGE,
          },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Scientific Committee',
    roles: [
      {
        role: 'Members',
        members: [
          {
            name: 'Dr Ravindra GL',
            designation: 'Scientific Chairperson',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Shivkumar M C',
            designation: 'Scientific Chairperson',
            image: PLACEHOLDER_IMAGE,
          },
          {
            name: 'Dr Kumara A B',
            designation: 'Scientific Co-Chairperson',
            image: PLACEHOLDER_IMAGE,
          },
          { name: 'Dr Rakesh M L', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Pooja Shah', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Shreehari SS', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Soumya Rao', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Abstract Committee',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Swathi Hegde', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Namratha', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Shashank', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Workshop Committee',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Yashoda V', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Sandhya', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vikram', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Bharath', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Praveen Kumar', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vadiraj Kulkarni', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Reception & Registration Committee',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Shruthi Hiremath', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vikram', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Sushma Pattar', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Kavya', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Bindu (NH)', designation: 'Other Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Travel & Accommodation',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Manjunath B N', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Sandeep Koti', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Karthik', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Praveen S', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Hospitality',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Basavaraj', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Praveen B J', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Kiran M', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Hemanth K J', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Cultural',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Shobha M M', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Shwetha Purohit', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vandana Hebballi', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Manasa S', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Memento & Kits',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Rashmi', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Bindu', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Sowmya Rao', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Venue Detailing',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Praveen S', designation: 'Member', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vandana Hebballi', designation: 'Member', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
];

const CommitteePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pb-20">
        {}
        <div className="relative overflow-hidden rounded-2xl mt-6 mb-8 border border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-[#005aa9] via-sky-700 to-indigo-700 opacity-90" />
          <div
            className="absolute inset-0 mix-blend-soft-light opacity-40"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=1200)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative px-6 lg:px-8 py-10 lg:py-12 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 backdrop-blur flex-shrink-0">
                <Users className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-semibold leading-tight">
                  AOACON 2026 Committee
                </h1>
                <p className="text-base lg:text-lg text-slate-100/90 mt-2 leading-relaxed">
                  Organizing teams behind AOA Shivamogga 2026 – structure, roles and responsibilities
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm lg:text-base">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/25 font-medium">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                30 Oct – 1 Nov 2026
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/25 font-medium">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                Shivamogga, Karnataka
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/25 font-medium">
                <Star className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                National Conference • AOA
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="mb-8 text-base lg:text-lg text-slate-700 leading-relaxed">
          <p>
            The conference is supported by dedicated teams overseeing scientific content, hospitality,
            workshops, cultural events, logistics, and delegate experience. Each section lists the key
            office bearers and team members with their designated roles.
          </p>
        </div>

        {}
        <div className="space-y-10 lg:space-y-12">
          {committees.map((section) => (
            <section
              key={section.sectionTitle}
              className="px-2 sm:px-4"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0b5f73] text-center mb-8">
                - {section.sectionTitle} -
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {section.roles.flatMap((roleBlock) => roleBlock.members).map((m, index) => (
                  <div
                    key={`${section.sectionTitle}-${m.name}-${index}`}
                    className="bg-white rounded-[18px] border border-slate-200 shadow-md px-6 py-6 text-center"
                  >
                    <div className="mx-auto w-28 h-28 rounded-full border-[2px] border-dotted border-[#8d3c6d] p-1">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <p className="mt-4 text-sm sm:text-lg font-semibold text-[#e11d74]">
                      {m.name}
                    </p>
                    <p className="text-xs sm:text-base font-semibold text-[#3a3a8a]">
                      {m.designation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommitteePage;
