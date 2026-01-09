import Header from '../../components/common/Header';
import anjuGrewal from '../../images/AOAOfficeBearers/Anju-Grewal.jpg';
import arunaParameswari from '../../images/AOAOfficeBearers/Aruna-Parameswari.jpg';
import kajalJain from '../../images/AOAOfficeBearers/Kajal-Jain.jpg';
import shilpaKasodeka from '../../images/AOAOfficeBearers/shilpa-kasodeka.jpg';
import glRavindra from '../../images/AOAOfficeBearers/GL-Ravindra.jpg';
import sunandaGupta from '../../images/AOAOfficeBearers/sunanda-gupta.jpg';
import anjanTrikha from '../../images/AOAOfficeBearers/anjan-trikha.jpg';
import sunilPandaya from '../../images/AOAOfficeBearers/sunil-pandaya.jpg';
import anjelenaKumar from '../../images/AOAOfficeBearers/Anjelena-Kumar.jpg';
import gitaNath from '../../images/AOAOfficeBearers/Gita-Nath.jpg';
import akilandeswari from '../../images/AOAOfficeBearers/Akilandeswari-M.jpg';
import nidhiBhatia from '../../images/AOAOfficeBearers/nidhi-bhatia.jpg';
import manokanthMadapu from '../../images/AOAOfficeBearers/manokanth-madapu.jpg';
import manishaShembrkar from '../../images/AOAOfficeBearers/manisha-shembrkar.jpg';
import lalitRaiger from '../../images/AOAOfficeBearers/Lalit K Raiger.png';

const topLeadership = [
  { role: 'President', name: 'Dr. Anju Grewal', image: anjuGrewal },
  { role: 'Secretary', name: 'Dr. Aruna Parameswari', image: arunaParameswari },
  { role: 'President Elect', name: 'Dr. Lalit K Raiger', image: lalitRaiger },
];

const middleLeadership = [
  { role: 'Vice President', name: 'Dr. Shilpa Kasodekar', image: shilpaKasodeka },
  { role: 'Joint Secretary', name: 'Dr. G. L. Ravindra', image: glRavindra },
  { role: 'Treasurer', name: 'Dr. Anjelena K Gupta', image: anjelenaKumar },
];

const pastLeadership = [
  { role: 'Founder President', name: 'Dr. Sunanda Gupta', image: sunandaGupta },
  { role: 'Past President', name: 'Dr. Anjan Trikha', image: anjanTrikha },
  { role: 'Past President', name: 'Dr. Sunil T Pandya', image: sunilPandaya },
  { role: 'Immediate Past President', name: 'Dr. Kajal Jain', image: kajalJain },
];

const executiveMembers = [
  { name: 'Dr. Gita Nath', image: gitaNath },
  { name: 'Dr. Akilandeswari M', image: akilandeswari },
  { name: 'Dr. Nidhi Bhatia', image: nidhiBhatia },
  { name: 'Dr. Manokanth Madapu', image: manokanthMadapu },
  { name: 'Dr. Manisha Shembekar', image: manishaShembrkar },
];

const OfficeBearersPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

        <section className="overflow-hidden border border-slate-200 bg-slate-900 text-white text-center">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-70  py-20"
              style={{
                backgroundImage:
                  'url(https://secureadmissions.in/wp-content/uploads/2025/06/10980_index_20.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-800/90" />

            <div className="relative px-6 lg:px-8 py-10 lg:py-12">
              <div className="flex flex-wrap items-center gap-4 mb-6 lg:mb-8  justify-center">
                <h1 className="text-2xl lg:text-3xl font-semibold leading-tight text-center">
                 Office Bearers 
                </h1>
              </div>
             
              <div className="flex flex-wrap gap-4 text-sm lg:text-base  justify-center">
                <span className=" font-medium">
                  Home | AOA Office Bearers
                </span>
                
              </div>
            </div>
          </div>
        </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="text-center">
          
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#d81b60]" />
        </div>

        <div className="mt-8 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 place-items-center">
            {topLeadership.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center gap-3">
                <p className="text-sm font-semibold text-[#9c3253]">{member.role}</p>
                <div className="rounded-full bg-gradient-to-tr from-[#b6842f] via-[#f6d27b] to-[#b6842f] p-1 shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover border-4 border-white"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 place-items-center">
            {middleLeadership.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center gap-3">
                <p className="text-sm font-semibold text-[#9c3253]">{member.role}</p>
                <div className="rounded-full bg-gradient-to-tr from-[#b6842f] via-[#f6d27b] to-[#b6842f] p-1 shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover border-4 border-white"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 place-items-center">
            {pastLeadership.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center gap-3">
                <p className="text-sm font-semibold text-[#9c3253]">{member.role}</p>
                <div className="rounded-full bg-gradient-to-tr from-[#b6842f] via-[#f6d27b] to-[#b6842f] p-1 shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover border-4 border-white"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-center text-sm font-semibold tracking-[0.3em] text-[#9c3253] uppercase">
              Executive Members
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 place-items-center">
              {executiveMembers.map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-gradient-to-tr from-[#b6842f] via-[#f6d27b] to-[#b6842f] p-1 shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover border-4 border-white"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfficeBearersPage;
