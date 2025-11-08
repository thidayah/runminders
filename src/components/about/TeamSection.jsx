import { Icon } from '@iconify/react'

const team = [
  {
    name: 'Jane Doe',
    role: 'Founder',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',    
    
    bio: 'Aktif di komunitas lari dan event organizer berbagai event besar.'
  },
  {
    name: 'John Doe',    
    role: 'Head of Product',    
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&h=400&fit=crop&crop=face',
    bio: 'Software engineer dengan spesialisasi dalam scalable systems.'
  },
  // {
  //   name: 'Bobby Devan',
  //   role: 'Tech Lead',
  //   image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  //   bio: 'Berpengalaman 5+ tahun dalam product development untuk platform fitness.'
  // },
  // {
  //   name: 'Maya Sari',
  //   role: 'Community Manager',
  //   image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',    
  //   bio: 'Penggiat lari marathon dengan passion di teknologi dan komunitas.',
  // }
]

export default function TeamSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tim Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Orang-orang berdedikasi di balik kesuksesan RUNminders
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> */}
        <div className="flex justify-center flex-col lg:flex-row gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 w-[25%]">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <div className="text-primary font-medium mb-3">{member.role}</div>
              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              
              {/* <div className="flex justify-center gap-3 mt-4">
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <Icon icon="mdi:linkedin" width="20" height="20" />
                </button>
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <Icon icon="mdi:twitter" width="20" height="20" />
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}