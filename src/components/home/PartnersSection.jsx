import Link from "next/link"

const partners = [
  {
    id: 1,
    name: 'GitHub',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    website: 'https://github.com',
  },
  {
    id: 2,
    name: 'GitLab',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
    website: 'https://gitlab.com',
  },
  {
    id: 3,
    name: 'Bitbucket',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg',
    website: 'https://bitbucket.org',
  },
  {
    id: 4,
    name: 'Vercel',
    logo: 'https://assets.vercel.com/image/upload/v1662130559/front/favicon/vercel/180x180.png',
    website: 'https://vercel.com',
  },
  {
    id: 5,
    name: 'Netlify',
    logo: 'https://www.netlify.com/v3/img/components/logomark.png',
    website: 'https://www.netlify.com',
  },
  {
    id: 6,
    name: 'Supabase',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
    website: 'https://supabase.com',
  },
  {
    id: 11,
    name: 'Cloudflare',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg',
    website: 'https://www.cloudflare.com',
  },
  {
    id: 12,
    name: 'DigitalOcean',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg',
    website: 'https://www.digitalocean.com',
  },
  {
    id: 13,
    name: 'OpenAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    website: 'https://openai.com',
  },
  {
    id: 7,
    name: 'Firebase',
    logo: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_96dp.png',
    website: 'https://firebase.google.com',
  },
]

export default function PartnersSection() {
  return (
    <section id="partners" className="pt-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Partner Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berkolaborasi dengan brand ternama dan event organizer terpercaya untuk menghadirkan pengalaman lari terbaik
          </p>
        </div>

        {/* Partners Grid - 6 columns on desktop, centered */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 gap-y-12 items-center justify-center">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-centerhover:shadow-lg transition-all duration-300 hover:scale-125 group justify-center"
            >
              <div className="text-center">
                {/* Logo Image */}
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg transition-colors duration-300">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                  // onError={(e) => {
                  //   // Fallback jika gambar error
                  //   e.target.style.display = 'none'
                  //   e.target.nextSibling.style.display = 'flex'
                  // }}
                  />
                  {/* Fallback initial letter */}
                  <div
                    className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full hidden items-center justify-center text-white font-bold text-lg"
                  >
                    {partner.name.charAt(0)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>


      </div>
      {/* Partnership CTA */}
      <div className="text-center mt-16 p-12 bg-gradient-to-br from-primary via-primary-dark to-neutral-dark text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Jadi Partner RUNminders?
        </h3>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Bergabunglah dengan jaringan partner kami dan jangkau ribuan pelari aktif di seluruh Indonesia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={'/contact'}
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
          >
            Jadi Event Organizer
          </Link>
          <Link
            href={'/contact'}
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all shadow-lg cursor-pointer duration-300"
          >
            Jadi Sponsor
          </Link>
        </div>
      </div>
    </section>
  )
}