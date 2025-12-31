import { Users, Calendar, MapPin, Star } from 'lucide-react';
import Header from '../../components/common/Header';
import ajithKumarImg from '../../images/OrganizingComittee/Ajith Kumar.png';
import ashwiniImg from '../../images/OrganizingComittee/Ashwini.png';
import avinashBenekappaImg from '../../images/OrganizingComittee/Avinash Benekappa.png';
import champaImg from '../../images/OrganizingComittee/Champa.jpg';
import dhananjaySarjiImg from '../../images/OrganizingComittee/Dhananjay Sarji.png';
import ravindraGlImg from '../../images/OrganizingComittee/GL-Ravindra.jpg';
import kumarAbImg from '../../images/OrganizingComittee/Kumar A B.png';
import manasaSImg from '../../images/OrganizingComittee/Manasa S.png';
import nagendraSImg from '../../images/OrganizingComittee/Nagendra S.png';
import namrathaLImg from '../../images/OrganizingComittee/Namratha L.png';
import praveenSImg from '../../images/OrganizingComittee/Praveen S.png';
import rashmiSImg from '../../images/OrganizingComittee/Rashmi S.png';
import shashankMImg from '../../images/OrganizingComittee/Shashank M.png';
import shivkumarImg from '../../images/OrganizingComittee/Shivkumar.png';
import shruthiHiremathImg from '../../images/OrganizingComittee/Shruthi Hiremath.png';
import srihariSImg from '../../images/OrganizingComittee/Srihari S.png';
import sushmaPattarImg from '../../images/OrganizingComittee/Sushma Pattar.png';
import swathiHegdeImg from '../../images/OrganizingComittee/Swathi Hegde.png';
import vandanaHebballiImg from '../../images/OrganizingComittee/Vandana Hebballi.png';
import virupakshappaImg from '../../images/OrganizingComittee/Virupakshappa.jpg';
import yashodhaVImg from '../../images/OrganizingComittee/Yashodha V.png';

const PLACEHOLDER_IMAGE =
  'https://thumbs.dreamstime.com/b/profile-placeholder-image-gray-silhouette-no-photo-person-avatar-default-pic-used-web-design-173998594.jpg';

const committees = [
  {
    sectionTitle: 'Chief Patron',
    roles: [
      {
        role: 'Dean & Director SIMS, Shivamogg',
        members: [
          {
            name: 'Dr. Virupakshappa V',
            designation: 'Dean & Director SIMS, Shivamogga',
            image: virupakshappaImg,
          },
        ],
      }
    ],
  },
   {
    sectionTitle: 'Patrons',
    roles: [
      {
        role: 'Medical Director SuIMS, Shivamogga',
        members: [
          {
            name: 'Dr. Nagendra S',
            designation: 'Medical Director SuIMS, Shivamogga',
            image: nagendraSImg,
          },
        ],
      },
        {
        role: 'MLC, Shivamogga Medical Director, Sarji Group of Hospitals Shivamogga',
        members: [
          {
            name: ' Dr. Dhananjaya Sarji',
            designation: 'MLC, Shivamogga Medical Director, Sarji Group of Hospitals Shivamogga',
            image: dhananjaySarjiImg,
          },
        ],
      },
        {
        role: 'Head, Dept. of Anaesthesiology, Sahyadri Narayana Multispeciality Hospital Shivamogg',
        members: [
          {
            name: ' Dr. Ajith Kumar Shetty',
            designation: 'Head, Dept. of Anaesthesiology, Sahyadri Narayana Multispeciality Hospital Shivamogg',
            image: ajithKumarImg,
          },
        ],
      },
        {
        role: 'CEO Nanjappa Healthcare Shivamogga',
        members: [
          {
            name: 'Dr. Avinash Benakappa',
            designation: 'CEO Nanjappa Healthcare Shivamogga',
            image: avinashBenekappaImg,
          },
        ],
      }
    ],
  },
    {
    sectionTitle: '',
    roles: [
      {
        role: 'Organizing Chairperson',
        members: [
          {
            name: 'Dr Ravindra G L',
            designation: 'Chief Consultant, Janani Anaesthesia & Critical Care Services Shivamogga',
            image: ravindraGlImg,
          },
        ],
      },
      {
        role: 'Organizing Secretary',
        members: [
          {
            name: 'Dr Champa B V',
            designation: 'Professor and Head Department of Anaesthesiology SIMS, Shivamogga',
            image: champaImg,
          },
        ],
      },
      {
        role: 'Treasurer',
        members: [
          {
            name: 'Dr Ashwini S',
            designation: 'Associate Professor Department of Anaesthesiology SIMS, Shivamogga',
            image: ashwiniImg,
          },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Scientific Team',
    roles: [
      {
        role: 'Scientific Chairpersons',
        members: [
          {
            name: 'Dr Ravindra G L',
            designation: 'Scientific Chairperson',
            image: ravindraGlImg,
          },
          {
            name: 'Dr Shivakumar M C',
            designation: 'Scientific Chairperson',
            image: shivkumarImg,
          },
        ],
      },
      {
        role: 'Co-Chairperson',
        members: [
          {
            name: 'Dr Kumara A B',
            designation: 'Scientific Co-Chairperson',
            image: kumarAbImg,
          },
        ],
      },
      {
        role: 'Members',
        members: [
          { name: 'Dr Swathi Hegde', designation: '', image: swathiHegdeImg },
          { name: 'Dr Namratha L', designation: '', image: namrathaLImg },
          { name: 'Dr Pooja Shah', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Shashank', designation: '', image: shashankMImg },
          { name: 'Dr Shreehari', designation: '', image: srihariSImg },
          { name: 'Dr Soumya Rao', designation: '', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
    {
    sectionTitle: 'Workshops & Courses',
    roles: [
      {
        role: 'Workshop Team Members',
        members: [
          { name: 'Dr Yashoda V', designation: 'Workshop Coordinator', image: yashodhaVImg },
          { name: 'Dr Sandhya', designation: 'Workshop Coordinator', image: PLACEHOLDER_IMAGE },
            { name: 'Dr Vadiraj Kulkarni', designation: 'Workshop Coordinator', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vikram A C', designation: 'Workshop Coordinator', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Bharath', designation: 'Workshop Coordinator', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Praveen Kumar K R', designation: 'Workshop Coordinator', image: PLACEHOLDER_IMAGE },
        
        ],
      },
      // {
      //   role: 'AOA Obstetric Critical Care Certification Course (2 days)',
      //   members: [
      //     { name: 'Dr Yashoda V', designation: 'Course Lead', image: PLACEHOLDER_IMAGE },
      //     { name: 'Dr Rashmi', designation: 'Course Faculty', image: PLACEHOLDER_IMAGE },
      //   ],
      // },
      // {
      //   role: 'Labour Analgesia (1 day)',
      //   members: [{ name: 'Dr Bharath', designation: 'Course Lead', image: PLACEHOLDER_IMAGE }],
      // },
      // {
      //   role: 'Critical Incidents in Obstetric Anaesthesia (1 day)',
      //   members: [{ name: 'Dr Sandhya', designation: 'Course Lead', image: PLACEHOLDER_IMAGE }],
      // },
      // {
      //   role: 'POCUS in Obstetric Anaesthesia (1 day)',
      //   members: [{ name: 'Dr Praveen Kumar', designation: 'Course Lead', image: PLACEHOLDER_IMAGE }],
      // },
      // {
      //   role: 'Maternal Collapse & Resuscitation / Obstetric RA Blocks (1 day)',
      //   members: [{ name: 'Dr Vikram', designation: 'Course Lead', image: PLACEHOLDER_IMAGE }],
      // },
    ],
  },
  {
    sectionTitle: 'Reception & Registration Team',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Shruthi Hiremath', designation: '', image: shruthiHiremathImg },
          { name: 'Dr Sushma Pattar', designation: '', image: sushmaPattarImg },
          { name: 'Dr Harish T S', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr. Swetha Purohit', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Bindu T V', designation: '', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
   {
    sectionTitle: 'Venue Detailing And Hall Coordination',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Praveen S', designation: '', image: praveenSImg },
          { name: 'Dr Vandana Hebballi', designation: '', image: vandanaHebballiImg },
        ],
      },
    ],
  },
   {
    sectionTitle: 'Memento & Awards Team',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Rashmi', designation: '', image: rashmiSImg },
          { name: 'Dr. Manasa S', designation: '', image: manasaSImg },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Travel & Accommodation Team',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Manjunath B N', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Sandeep Koti', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Karthik', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Praveen S', designation: '', image: praveenSImg },
        ],
      },
    ],
  },
 

  {
    sectionTitle: 'Hospitality Team',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Basavaraj', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Praveen B J', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Kiran M', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Hemanth K J', designation: '', image: PLACEHOLDER_IMAGE },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Cultural Team',
    roles: [
      {
        role: 'Members',
        members: [
          { name: 'Dr Shobha M M', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Shwetha Purohit', designation: '', image: PLACEHOLDER_IMAGE },
          { name: 'Dr Vandana Hebballi', designation: '', image: vandanaHebballiImg },
          { name: 'Dr Manasa S', designation: '', image: manasaSImg },
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
          {committees.map((section, sectionIndex) => {
            const showSectionTitle =
              section.sectionTitle === 'Chief Patron' || section.sectionTitle === 'Patrons';
            const showRoleTitle = !showSectionTitle;

            return (
              <section key={section.sectionTitle} className="px-2 sm:px-4">
                {showSectionTitle && (
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0b5f73] text-center mb-8">
                    - {section.sectionTitle} -
                  </h2>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 sm:gap-8 justify-center mx-auto max-w-7xl">
                  {section.roles.flatMap((roleBlock) =>
                    roleBlock.members.map((member, index) => (
                      <div
                        key={`${section.sectionTitle}-${member.name}-${index}`}
                        className="text-center"
                      >
                        {showRoleTitle && (
                          <p className="text-base sm:text-lg font-semibold text-[#0b5f73] mb-4 uppercase tracking-wide">
                            {roleBlock.role}
                          </p>
                        )}
                        <div className="bg-white rounded-[18px] border border-slate-200 shadow-md px-6 py-6 text-center flex flex-col justify-between">
                          <div className="mx-auto w-28 h-28 rounded-full border-[2px] border-dotted border-[#8d3c6d] p-1">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <p className="mt-4 text-sm sm:text-lg font-semibold text-[#e11d74]">
                            {member.name}
                          </p>
                          <p className="text-xs sm:text-base font-semibold text-[#3a3a8a]">
                            {member.designation}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {sectionIndex === 1 && (
                  <div className="h-10 sm:h-14 lg:h-16" aria-hidden="true" />
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommitteePage;
